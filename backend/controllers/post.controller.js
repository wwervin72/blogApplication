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
				return res.status(404).json({
					result: false,
					msg: '404 not found'
				});
			}
			return next();
		})
	},
	getAllPost: function (req, res, next) {
		Post.find({}, function (err, posts) {
			if(err){
				return next(err);
			}
			return res.status(200).json({
				result: true,
				data: posts
			});
		})
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
			Post.find({user: user.username}, function (err, posts) {
				if(err){
					next(err);
				}			
				return res.status(200).json({
					result: true,
					data: posts
				});
			});
		})
	}
}