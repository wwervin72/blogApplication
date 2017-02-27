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

let setPostTime = () => {
	let date = new Date();
	let month = date.getMonth() + 1;
	month = month < 10 ? ('0' + month) : month;

	let day = date.getDate();
	day = day < 10 ? ('0' + day) : day;

	let hours = date.getHours();
	hours = hours < 10 ? ('0' + hours) : hours;

	let minutes = date.getMinutes();
	minutes = minutes < 10 ? ('0' + minutes) : minutes;

	let seconds = date.getSeconds();
	seconds = seconds < 10 ? ('0' + seconds) : seconds;

	return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

let getPostCreateTime = time => {
	console.log(time)
	return time;  
}

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
		set: setTags
		// get: getTags
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

mongoose.model('Post', PostSchema);