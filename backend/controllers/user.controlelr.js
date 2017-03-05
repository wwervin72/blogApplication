let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let tokenManage = require('../utils/tokenManage');
let config = require('config-lite');
module.exports = {
	findUserByName: function (req, res, next) {
		User.findOne({username: req.query.username || req.user.username}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(404).json({
					result: false,
					msg: '404 not found'
				});
			}
			return next();
		});
	},
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
					token: tokenManage.createNewToken(user),
					info: {
						username: user.username,
						avatar: user.avatar,
						nickname: user.nickname
					}
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
				_id: req.user._id,
				nickname: req.user.nickname,
				username: req.user.username,
				avatar: req.user.avatar
			},
			token: tokenManage.createNewToken(req.user),
			result: true
		});
	},
	createCaptcha: function (req, res, next) {
		res.status(200).json({
			result: false,
			msg: '没有验证码'
		})
	}
};