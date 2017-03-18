let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let article = mongoose.model('Post');
let User = mongoose.model('User');
let moment = require('moment');

let getHearts = heart => heart.length;

let getStamps = stamp => stamp.length;

let CommentsSchema = new Schema({
	article: {
		type: Schema.ObjectId,
		ref: 'Post'
	},
	authorNickname: {
		type: String,
		trim : true
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		default: '',
		trim : true
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	// 父评论，一般是回复的上一个人，如果为空数组，则是文章的根评论
	replyParent: [{
		type: Schema.ObjectId,
		ref: 'Comment'
	}],
	// 子评论，一般是回复的评论
	reply: [{
		type: Schema.ObjectId,
		ref: 'Comment'
	}],
	heart: {
		type: Array,
		get: getHearts,
	},
	stamp: {
		type: Array,
		get: getStamps,
	}
});

// 格式验证
CommentsSchema.path('article').validate(article => article.length, '评论文章不能为空');
CommentsSchema.path('content').validate(content => content.length, '评论内容不能为空');
CommentsSchema.path('author').validate(author => author.length, '评论作者不能为空');
CommentsSchema.path('authorNickname').validate(authorNickname => authorNickname.length, '评论作者昵称不能为空');

// 格式化时间
CommentsSchema.path('createDate').get(val => moment(val).format('YYYY-MM-DD hh:mm:ss'));

CommentsSchema.set('toJSON', {getters: true, virtuals: false});

mongoose.model('Comment', CommentsSchema);