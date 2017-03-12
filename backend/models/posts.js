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

let getHearts = heart => {
	return heart.length;
};

let getStamps = stamp => {
	return stamp.length;
};

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
		type: Array,
		get: getHearts
	},
	// 反对数
	stamp: {
		type: Array,
		get: getStamps
	}
});

PostSchema.path('createAt').get(function (value) {
  return moment(value).format('YYYY-MM-DD hh:mm:ss');
});

PostSchema.set('toJSON', {getters: true, virtuals: false});


mongoose.model('Post', PostSchema);