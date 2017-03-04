let mongoose = require('mongoose');
let User = mongoose.model('User');
let Post = mongoose.model('Post');

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
	findPostById: function (req, res, next) {
		Post.findOne({id: req.query.id}, function (err, post) {
			if(err){
				return next(err);
			}
			if(!post){
				return next();
			}
			return next();
		})
	},
	getAllPost: function (req, res, next) {
		Post.find().populate('author', ['nickname', 'avatar', 'username']).sort({_id: -1})
		.exec(function (err, posts) {
			if(err){
				return next(err);
			}
			return res.status(200).json({
				result: true,
				data: posts
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
			Post.findOne({author: user._id, id: req.query.articleId})
				.populate('author', ['nickname', 'avatar', 'username'])
				.exec(function (err, article) {
					if(err){
						return next(err);
					} 
					if(!article){
						return next();
					}
					return res.status(200).json({
						result: true,
						msg: '文章获取成功',
						data: article
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
	}
}