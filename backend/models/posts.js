let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');

let setTags = tags => {
	let res = [];
	tags.split(',').forEach(function (item) {
		if(res.indexOf(item) === -1){
			res.push(item)
		}
	});
	return res;
};

let getHearts = heart => heart.length;

let getStamps = stamp => stamp.length;

let PostSchema = new Schema({
	id: {
		type: String,
		default: String(new Date().getTime()),
		unique: true
	},
	// 文章标题
	title: {
		type: String,
		default: '',
		trim: true
	},
	// 文章内容
	content: {
		type: String, 
		default: '', 
		trim: true
	},
	// 文章作者
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	// 文章评论
	comments: {
		type: Number,
		default: 0,
	},
	// 文章标签
	tags: {
		type: Array,
		set: setTags,
	},
	// 创建时间
	createAt: {
		type: Date,
		default: Date.now
	},
	// 阅读量
	views: {
		type: Number,
		default: 0
	},
	// 推荐数
	heart: {
		type: Array
	},
	// 反对数
	stamp: {
		type: Array
	}
});

PostSchema.path('title').validate(title => title.length, '文章标题不能为空');
PostSchema.path('content').validate(content => content.length, '文章内容不能为空');
PostSchema.path('author').validate(author => author.length, '文章作者不能为空');

PostSchema.path('createAt').get(value => moment(value).format('YYYY-MM-DD hh:mm:ss'));

PostSchema.set('toJSON', {getters: true, virtuals: false});


mongoose.model('Post', PostSchema);