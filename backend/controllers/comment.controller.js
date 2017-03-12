let mongoose = require('mongoose');
let Comment = mongoose.model('Comment');
let Article = mongoose.model('Post');

module.exports = {
	createComment: function (req, res, next) {
		let comment = new Comment({
			article: req.body.articleId,
			author: req.body.authorId,
			content: req.body.content.trim(),
			prev: req.body.replyParent,
			next: req.body.reply
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
							.populate({path: 'author', model: 'User', select: ['_id', 'nickname', 'avatar']})
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
									data: cmt
								});
					});
				})
		})
	},
	getArticleComments: function (req, res, next) {
		Comment.find({article: req.query.articleId})
				.populate({path: 'author', model: 'User', select: ['_id', 'nickname', 'avatar', 'username']})
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
		}
}