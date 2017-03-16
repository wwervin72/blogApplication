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
	// 父评论，一般是回复的上一个人，如果为空数组，则是文章的根评论
	replyParent: [{
		type: Schema.ObjectId,
		ref: 'Comments'
	}],
	// 子评论，一般是回复的评论
	reply: [{
		type: Schema.ObjectId,
		ref: 'Comments'
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

CommentsSchema.path('createDate').get(function (val) {
	return moment(val).format('YYYY-MM-DD hh:mm:ss');
});

CommentsSchema.post('find', function (result, next) {
	result.forEach(function (ele, i) {
		if(ele.replyParent.length){
			User.find({_id: {$in: ele.replyParent}}, function (err, list) {
				if(err){
					return next(err);
				}
				console.log(list);
				ele.replyParent = list;
				if(i === result.length - 1){
					next();
				}
			});
		}
	})
})

CommentsSchema.set('toJSON', {getters: true, virtuals: false});

mongoose.model('Comment', CommentsSchema);