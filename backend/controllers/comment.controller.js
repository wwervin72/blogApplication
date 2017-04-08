let mongoose = require('mongoose');
let Comment = mongoose.model('Comment');
let Article = mongoose.model('Post');
let tokenManage = require('../utils/tokenManage');

module.exports = {
	createComment: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		let comment = new Comment({
			article: req.body.articleId,
			author: req.body.authorId,
			content: req.body.content.trim(),
			replyParent: req.body.replyParent,
			replyUser: req.body.replyUser,
			reply: req.body.reply
		});
		comment.save(function (err) {
			if(err){
				return next(err);
			}
			// 文章的评论数++
			Article.update({_id: comment.article},
				{$inc: {
					comments: 1
				}}, function (err, result) {
					if(err){
						return next(err);
					}
					// 找到该条评论信息，并返回
					Comment.findOne({_id: comment._id})
							.populate({path: 'author', model: 'User', select: ['_id', 'nickname', 'avatar', 'username']})
							.populate({path: 'replyUser', model: 'User'})
							.exec(function (err, cmt) {
								if(err){
									return next(err);
								}
								if(!cmt){
									return next();
								}
								return res.status(200).json({
									result: true,
									msg: '评论成功',
									data: cmt,
									token: token
								});
					});
				})
		})
	},
	getArticleComments: function (req, res, next) {
		Comment.find({article: req.query.articleId})
				.populate({path: 'author', model: 'User', select: ['_id', 'nickname', 'avatar', 'username']})
				.populate({path: 'replyUser', model: 'User'})
				.sort({_id: 1})
				.exec(function (err, result) {
					if(err){
						return next(err);
					}
					return res.status(200).json({
						result: true,
						msg: '文章评论获取成功',
						data: result
					});
				});
		},
	updateComment: (req, res, next) => {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		Comment.update({_id: req.body.commentId},
						{$set: {
							content: req.body.newComment,
							createDate: Date.now()
						}}, function (err, result) {
							if(err){
								return next(err);
							}
							if(!result.nModified){
								return res.status(200).json({
									result: false,
									msg: '修改失败'
								});
							}
							return res.status(200).json({
								result: true,
								msg: '修改成功',
								token: token
							});
						});
	},
	deleteComment: (req, res, next) => {
		if(req.body.authorId === req.user._id){
			Comment.remove({_id: req.body.commentId})
					.exec(function (err, result) {
						if(err){
							return next(err);
						}
						if(!result.result.n){
							return res.status(200).json({
								result: false,
								msg: '删除失败'
							});
						}
						Article.update({_id: req.body.articleId},
										{$inc: {
											comments: -1
										}}, function (err, result) {
											if(err){
												return next(err);
											}
											return res.status(200).json({
												result: true,
												msg: '删除成功',
												token: tokenManage.createNewToken(req.user)
											});
										})
					});
		}else{
			return res.status(200).json({
				result: false,
				msg: '只能删除自己的评论'
			});
		}
	},
	heart: function (req, res, next) {
		if(req.user._id === req.query.authorId){
			return res.status(200).json({
				result: false,
				msg: '不能点赞自己的评论'
			});
		}
		Comment.findOne({_id: req.query.commentId}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result){
				return next();
			}
			if(result.heart.indexOf(req.user._id) !== -1){
				return res.status(200).json({
					result: false,
					msg: '不能重复点赞'
				});
			}
			if(result.stamp.indexOf(req.user._id) !== -1){
				result.stamp.pull(req.user._id);
			}
			result.heart.addToSet(req.user._id);
			result.save(function (err, result) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true,
					msg: '点赞成功',
					data: result,
					token: tokenManage.createNewToken(req.user)
				});
			});
		});
	},
	stamp: function (req, res, next) {
		if(req.user._id === req.query.authorId){
			return res.status(200).json({
				result: false,
				msg: '不能反对自己的评论'
			});
		}
		Comment.findOne({_id: req.query.commentId}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result){
				return next();
			}
			if(result.stamp.indexOf(req.user._id) !== -1){
				return res.status(200).json({
					result: false,
					msg: '不能重复反对'
				});
			}
			if(result.heart.indexOf(req.user._id) !== -1){
				result.heart.pull(req.user._id);
			}
			result.stamp.addToSet(req.user._id);
			result.save(function (err, result) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true,
					msg: '反对成功',
					data: result,
					token: tokenManage.createNewToken(req.user)
				});
			});
		});
	}
}