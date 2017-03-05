let mongoose = require('mongoose');
let User = mongoose.model('User');
let Post = mongoose.model('Post');
let moment = require('moment');

module.exports = {
	createPost: function (req, res, next) {
		let post = new Post({
			title: req.body.title,
			content: req.body.content,
			author: req.user._id,
			tags: req.body.tags
		});
		post.save(function (err, post) {
			if(err){
				return next(err);
			}
			return res.status(200).json({
				result: true,
				msg: '创建成功',
				data: post
			});
		});
	},
	getAllPost: function (req, res, next) {
		Post.find().populate('author', ['nickname', 'avatar', 'username']).sort({_id: -1})
		.exec(function (err, articles) {
			if(err){
				return next(err);
			}
			articles.forEach(function (item) {
				item.heart = item.heart.length;
				item.stamp = item.stamp.length;
			});
			return res.status(200).json({
				result: true,
				data: articles
			});
		});
	},
	findArticleById: function (req, res, next) {
		User.findOne({username: req.query.username}, function (err, user) {
			if(err){
				return next(err);
			} 
			if(!user){
				return next();
			}
			Post.findOne({id: req.query.articleId, author: user._id})
				.populate({path: 'author', model: 'User', select: ['nickname', 'avatar', 'username']})
				.exec(function (err, article) {
					if(err){
						return next(err);
					} 
					if(!article){
						return next();
					}
					article.heart = article.heart.length;
					article.stamp = article.stamp.length;
					return res.status(200).json({
						result: true,
						msg: '文章获取成功',
						data: article.toJSON()
					});
				});
		});
	},
	getUserPosts: function (req, res, next) {
		User.findOne({username: req.query.username}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return next();
			}
			// 查找该用户的所有文章
			Post.find({author: user._id})
				.populate('author', ['nickname', 'avatar', 'username'])
				.sort({_id: -1})
				.exec(function (err, articles) {
				if(err){
					next(err);
				}			
				return res.status(200).json({
					result: true,
					data: articles
				});
			});
		})
	},
	update: function (req, res, next) {
		Post.update({id: req.body.articleId, author: req.user._id},
					{$set: {
						title: req.body.title,
						content: req.body.content,
						tags: req.body.tags,
						createAt: Date.now()
					}}, function (err) {
						if(err){
							return res.status(200).json({
								result: false,
								msg: '修改失败'
							});
						}
						return res.status(200).json({
							result: true,
							msg: '修改成功'
						});
					});
	},
	heart: function (req, res, next) {
		Post.findOne({_id: req.query.articleId}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result){
				return next();
			}
			if(result.heart.indexOf(req.user._id) !== -1){
				return res.status({
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
				result.heart = result.heart.length;
				result.stamp = result.stamp.length;
				return res.status(200).json({
					result: true,
					msg: '点赞成功',
					data: result
				});
			});
		});
	},
	stamp: function (req, res, next) {
		Post.findOne({_id: req.query.articleId}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result){
				return next();
			}
			if(result.stamp.indexOf(req.user._id) !== -1){
				return res.status({
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
				result.heart = result.heart.length;
				result.stamp = result.stamp.length;
				return res.status(200).json({
					result: true,
					msg: '反对成功',
					data: result
				});
			})
		});
	}
}