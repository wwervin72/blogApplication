let mongoose = require('mongoose');
let crypto = require('crypto');
let Schema = mongoose.Schema;
let config = require('config-lite');

function connectMongoDB (argument) {
	mongoose.Promise = global.Promise;
	return mongoose.connect(config.mongoDB).connection;
}

connectMongoDB()
	.on('error', console.log)
	.on('disconnected', connectMongoDB)
	.once('open', console.log);

let UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	nickname: {
		type: String,
		default: createNickname()
	},
	avatar: {
		type: String,
		default: 'http://localhost:3000/upload/defaultAvatar.jpg'
	},
	hashed_password: String,
	salt: String,
	email: String,
	tokens: Array,
	github: String,
	profile: {}
});

UserSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptoPassword(password);
	})
	.get(function () {
	    return this._password;
	});

UserSchema.path('username').validate((username) => {
	return /^[a-z]{1}[a-z0-9]{0,5}$/.test(username);
}, '用户名必须是以字母开头的1到6个长度的小写字母或者数字');

UserSchema.path('hashed_password').validate(function(hashed_password){
	return /^[a-zA-Z0-9-_.]{3,12}$/.test(this.toObject({virtuals: true}).password);
}, '密码必须是长度为3到12个的字母、数字、-、_、.');

UserSchema.methods = {
	makeSalt: () => {
		return Math.round(new Date().getTime() * Math.random()) + '';
	},
	encryptoPassword: function(password) {
		if(!password){
			return '';	
		}
		return crypto.createHmac('sha1', this.salt)
			.update(password)
			.digest('hex');
	},
	authenticate: function(pwd){
		return this.encryptoPassword(pwd) === this.hashed_password;
	}
};

mongoose.model('User', UserSchema);

// 利用随机数生成一个5-10长度的昵称
function createNickname () {
	let str = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// nickname的长度为5-10
	let nickNameLen = Math.floor(Math.random() * (10 - 5 + 1) + 5);
	let nickName = [];
	while (nickNameLen) {
		nickName.push(str.substr(Math.floor(Math.random() * 62), 1));
		nickNameLen--;
	}
	return nickName.join('');
}