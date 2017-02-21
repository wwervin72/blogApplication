let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = new Schema({
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
		default: Date.now()
	}
});

mongoose.model('Tag', TagSchema);