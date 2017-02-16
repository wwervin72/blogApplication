let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let tokenManage = require('../utils/tokenManage');

module.exports = {
	login: (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if(err){
				return next(err);
			}
			if(!user){
				res.status(200);
				return res.json({
					result: false,
					msg: '用户名不存在'
				});
			}
			req.logIn(user, (err) => {
				if(err){
					return next(err);
				}
				req.user = user;
				let token = jwt.sign({
					data: user
				}, 'ervin', {expiresIn: 60 * 30});
				return res.status(200).json({
					result: true,
					msg: '登陆成功',
					data: {
						user: user._id
					},
					token: token
				});
			});
		})(req, res, next);
	},
	register: (req, res, next) => {
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
	signOut: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		if(token != null){
			tokenManage.expireToken(token);
			delete req.user;
			return res.status(200).json({
				result: true,
				msg: '登出成功'
			});
		}else{
			return res.status(401).json({
				result: false,
				msg: '没有token'
			});
		}
	},
	getInfo: function (req, res, next) {
		return res.status(200).json(req.user);
	}
};