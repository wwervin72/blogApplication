let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let tokenManage = require('../utils/tokenManage');
let config = require('config-lite');
// let captcha = require('canvas-captcha');

// let captchaOptions = {
// 	charPool: ('abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + '1234567890').split(''), //char pool Array 
//     size: {
//         width: 100,
//         height: 32
//     }, //image size 
//     textPos: {
//         left: 15,
//         top: 26
//     }, //text drawing start position 
//     rotate: .01, //text ratate 
//     charLength: 4, //how many chars 
//     font: '26px Unifont', //font size 
//     strokeStyle: '#0088cc', //style 
//     bgColor: '#eeeeee', //bg color 
//     confusion: true, //draw another group background text to mangle the text 
//     cFont: '30px Arial', //bg text style 
//     cStrokeStyle: '#adc', //bg text color 
//     cRotate: -.05, //bg text rotate 
// };
module.exports = {
	login: function(req, res, next){
		if(req.body.username === '' || req.body.password === ''){
			return res.status(200).json({
					result: false,
					msg: '用户名或者密码为空'
				});
		}
		passport.authenticate('local', function(err, user, info){
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(200).json({
					result: false,
					msg: info.message
				});
			}
			req.logIn(user, (err) => {
				if(err){
					return next(err);
				}
				
				return res.status(200).json({
					result: true,
					msg: '登陆成功',
					token: tokenManage.createNewToken(user)
				});
			});
		})(req, res, next);
	},
	register: function(req, res, next){
		for(let prop in req.body){
			if(req.body[prop] === ''){
				delete req.body[prop];
			}
		}
		let user = new User(req.body);
		user.save((err, user) => {
			if(err) {
				let msg = {};

				Object.keys(err.errors).forEach(function (item) {
					msg[item==='hashed_password'?'password':item] = err.errors[item].message;
				});
				res.status(200);
				return res.json({
					result: false,
					msg: msg
				});
			}
			res.status(200);
			return res.json({
				result: true,
				msg: '注册成功'
			});
		})
	},
	// 检查用户名、邮箱等是否唯一
	registerCheckUnique: function (req, res, next) {
		let propArr = Object.keys(req.query);
		switch (propArr[0]) {
			case 'username':
				propArr = '用户名';
				break;
			case 'email':
				propArr = '邮箱';
				break;
		}
		User.findOne(req.query, function (err, user) {
			if(err){
				return res.status(500).json({
					result: false,
					msg: '服务器错误'
				});
			}
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该'+propArr+'已被占用'
				});
			}
			return res.status(200).json({
					result: true,
					msg: '该'+propArr+'可以使用'
				});
		})
	},
	signOut: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		tokenManage.expireToken(token);
		delete req.user;
		return res.status(200).json({
			result: true,
			msg: '登出成功'
		});
	},
	getInfo: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		tokenManage.expireToken(token);
		return res.status(200).json({
			user: {
				nickname: req.user.nickname,
				username: req.user.username,
				avatar: req.user.avatar
			},
			token: tokenManage.createNewToken(req.user),
			result: true
		});
	},
	createCaptcha: function (req, res, next) {
		// captcha(captchaOptions, function (err, data) {
		// 	if(err){
		// 		return res.status(200).json({
		// 			result: false,
		// 			msg: '获取验证码失败'
		// 		});
		// 	}
		// 	console.log(data.captchaImg);
		// 	res.status(200).json({
		// 		result: true,
		// 		msg: data.captchaImg
		// 	});
		// });
		res.status(200).json({
			result: false,
			msg: '没有验证码'
		})
	}
};