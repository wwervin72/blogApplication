let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
// let objectIdToTimestamp = require('objectid-to-timestamp');

let getTags = tags => tags.join(',');
let setTags = tags => tags.split(',');

let PostSchema = new Schema({
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
	comments: [{
		content: {
			type: String,
			default: ''
		},
		author: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		createAt: {
			type: Date,
			default: Date.now
		}
	}],
	// 文章标签
	tags: {
		type: Array,
		set: setTags,
		get: getTags
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
		type: Number,
		default: 0
	},
	// 反对数
	stamp: {
		type: Number,
		default: 0
	}
});

PostSchema.post('find', function (result, next) {
	result.forEach(function (item, index) {

		// item.tags = item.tags.get();
		// console.log(mongoose.model('Post').tags)
	});
	result.map(function (item) {
		item.created_at = moment(item.createAt).format('YYYY-MM-DD HH:mm');
	});
	console.log(result)
	next();
});

mongoose.model('Post', PostSchema);