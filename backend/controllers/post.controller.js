let mongoose = require('mongoose');
let User = mongoose.model('User');
let Post = mongoose.model('Post');

module.exports = {
	getAllPost: function (req, res, next) {
		return res.status(200).json({
			result: true,
			data: '所有文章'
		});
	},
	getUserPosts: function (req, res, next) {
		User.findOne({username: req.username}, function (err, user) {
			if(err){
				next(err);
			}
			if(!user){
				return res.status(200).json({
					result: false,
					msg: '用户名不存在'
				});
			}
			// 查找该用户的所有文章
			return res.status(200).json({
					result: false,
					msg: '用户名不存在'
				});
		})
	}
}