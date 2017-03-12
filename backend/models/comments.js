let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let article = mongoose.model('Post');
let moment = require('moment');

let CommentsSchema = new Schema({
	article: {
		type: Schema.ObjectId,
		ref: 'Post'
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		default: ''
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	// 父评论，一般是回复的上一个人，如果为空数组，则是文章的跟评论
	replyParent: [{
		type: Schema.ObjectId,
		ref: 'Comments'
	}],
	// 子评论，一般是回复的评论
	reply: [{
		type: Schema.ObjectId,
		ref: 'Comments'
	}]
});

CommentsSchema.path('createDate').get(function (val) {
	return moment(val).format('YYYY-MM-DD hh:mm:ss');
});

CommentsSchema.set('toJSON', {getters: true, virtuals: false});

mongoose.model('Comment', CommentsSchema);