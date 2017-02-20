let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let getTags = tags => tags.join(',');
let setTags = tags => tags.split(',');

let PostSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true
	},
	body: {
		type: String, 
		default: '', 
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [{
		body: {
			type: String,
			default: ''
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		createAt: {
			type: Date,
			default: Date.now
		}
	}],
	tags: {
		type: [],
		get: getTags,
		set: setTags
	},
	img: {
		url: String,
		files: []
	},
	createAt: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Post', PostSchema);