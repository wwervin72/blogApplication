let mongoose = require('mongoose');
let User = mongoose.model('User');
let Post = mongoose.model('Post');
let Comment = mongoose.model('Comment');
let moment = require('moment');
let tokenManage = require('../utils/tokenManage');

module.exports = {
	createPost: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		let post = new Post({
			id: Math.round(new Date().getTime() * Math.random()) + '',
			title: req.body.title,
			abstract: req.body.abstract,
			content: req.body.content,
			author: req.user._id,
			tags: req.body.tags,
			avatar: req.body.avatar || 'http://localhost:3000/asset/defaultArticleAvatar.jpg'
		});
		post.save(function (err, post) {
			if(err){
				return next(err);
			}
			return res.status(200).json({
				result: true,
				msg: '创建成功',
				data: post,
				token: token
			});
		});
	},
	getAllPost: function (req, res, next) {
		let pageNum = req.query.pageNum - 0;
		let start = (req.query.currentPage - 1) * pageNum;
		Promise.all([
			Post.find()
				.populate('author', ['nickname', 'avatar', 'username'])
				.sort({_id: -1})
				.skip(start)
				.limit(pageNum)
				.exec(),
			Post.count()
				.exec()	
		]).then(function (result) {
			return res.status(200).json({
				result: true,
				data: result[0],
				total: result[1]
			});
		}, function (err) {
			return res.status(200).json({
				result: false,
				msg: err
			});
		});
	},
	findArticleById: function (req, res, next) {
		Post.findOne({id: req.query.articleId})
			.populate({path: 'author', model: 'User', select: ['_id','nickname', 'avatar', 'username', 'attentions', 'fans']})
			.exec(function (err, article) {
				if(err){
					return next(err);
				}
				if(!article){
					return next();
				}
				if(article.author.username !== req.query.username){
					return next();
				}
				
				Promise.all([
					Post.find({author: mongoose.Types.ObjectId(article.author._id), createAt: {$lt: article.createAt}}).sort({_id: 1}).limit(1).exec(),
					Post.find({author: mongoose.Types.ObjectId(article.author._id), createAt: {$gt: article.createAt}}).sort({_id: -1}).limit(1).exec()
				]).then(result => {
					Post.update({id: req.query.articleId}, 
								{$inc: {
									views: 1
								}}, function (error, ret) {
									if(error){
										return next(err);
									}
									if(!ret.nModified){
										return next();
									}
									article.views += 1;
									return res.status(200).json({
											result: true,
											msg: '文章获取成功',
											data: article,
											prev: result[0][0] ? null : result[0][0],
											next: result[1][0] ? null : result[1][0]
										});
								});
				}, err => {
					return next(err);
				});
			});
	},
	getUserPosts: function (req, res, next) {
		let pageNum = req.query.pageNum - 0;
		let start = (req.query.currentPage - 1) * pageNum;

		User.findOne({username: req.query.username}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return next();
			}
			Promise.all([
				Post.find({author: user._id})
					.populate('author', ['nickname', 'avatar', 'username'])
					.sort({_id: -1})
					.skip(start)
					.limit(pageNum)
					.exec(),
				Post.count({author: user._id})
					.exec()
			]).then(function (data) {
				return res.status(200).json({
					result: true,
					data: data[0],
					total: data[1]
				});
			}, function (data) {
				return res.status(200).json({
					result: false,
					msg: '数据获取失败'
				});
			})
		})
	},
	update: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		Post.update({id: req.body.articleId, author: req.user._id},
					{$set: {
						title: req.body.title,
						content: req.body.content,
						tags: req.body.tags,
						createAt: Date.now()
					}}, function (err) {
						if(err){
							return next(err);
						}
						return res.status(200).json({
							result: true,
							msg: '修改成功',
							token: token
						});
					});
	},
	heart: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		Post.findOne({_id: req.query.articleId}, function (err, result) {
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
					token: token
				});
			});
		});
	},
	stamp: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		Post.findOne({_id: req.query.articleId}, function (err, result) {
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
					token: token
				});
			})
		});
	},
	// 推荐文章列表 按照时间排序, 取前十条
	getHeartArticle (req, res, next) {
		Post.find({})
			.populate('author', ['nickname', 'avatar', 'username'])
			.sort({createAt: -1})
			.skip(req.query.skip - 0 || 0)
			.limit(req.query.limit - 0 || 10)
			.exec((err, result) => {
				if(err){
					return next(err);
				}
				result.sort((a, b) => a.heart.length - b.heart.length);
				return res.status(200).json({
					msg: '最新推荐文章获取成功',
					data: result,
					result: true
				});
			});
	},
	// 阅读文章列表 按照时间排序, 取前十条
	getViewArticle (req, res, next) {
		Post.find({})
			.populate('author', ['nickname', 'avatar', 'username'])
			.sort({createAt: -1})
			.skip(req.query.skip - 0 || 0)
			.limit(req.query.limit - 0 || 10)
			.exec((err, result) => {
				if(err){
					return next(err);
				}
				result.sort((a, b) => a.views.length - b.views.length);
				return res.status(200).json({
					msg: '最新推荐文章获取成功',
					data: result,
					result: true
				});
			});
	},
	// 删除文章
	deleteArticle: (req, res, next) => {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		if(req.user._id === req.body.authorId){
			// 删除文章下的评论
			Comment.remove({articleId: req.body.articleId}, function (err, result) {
				if(err){
					return next(err);
				}
				// 删除文章
				Post.remove({_id: req.body.articleId}, function (error, resultP) {
					if(error){
						return next(error);
					}
					if(!resultP.result.n){
						return next();
					}
					return res.status(200).json({
						result: true,
						msg: '删除成功',
						token: token
					});
				})	

			})
		}else{
			return res.status(200).json({
				result: false,
				msg: '只能删除自己的文章',
				token: token
			});
		}
	}
}