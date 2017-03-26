let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let config = require('config-lite');
let tokenManage = require('../utils/tokenManage');
let mailer = require('../utils/email')(config);
let uploadfile = require('../utils/uploadFile');
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
						nickname: user.nickname,
						email: user.email,
						_id: user._id,
						bio: user.bio,
						url: user.url,
						sex: user.sex
					}
				});
			});
		})(req, res, next);
	},
	register: function(req, res, next){
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
			return res.status(200).json({
				result: true,
				msg: '注册成功',
				token: tokenManage.createNewToken(user),
				info: {
					username: user.username,
					avatar: user.avatar,
					nickname: user.nickname
				}
			});
		});
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
				avatar: req.user.avatar,
				email: req.user.email,
				bio: req.user.bio,
				url: req.user.url,
				sex: req.user.sex
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
	},
	// 发送邮件（验证码）
	sendAuthCode: function (req, res, next) {
		let authCode = (function () {
			let str = 'abcdefghijklmnopqrstuvwxyz1234567890';
			let authCode = [];
			let codeLen = 6;
			while (codeLen) {
				authCode[authCode.length] = str.substr(Math.floor(Math.random() * 36), 1);
				codeLen--;
			}
			return authCode.join('');
		}());

		let html = '<p>你的账号<strong style="font-weight:bold;color:#f00;">，<strong style="color:#f00;text-decoration:underline;">';
			html += req.query.username;
			html += '</strong>正在进行重置密码操作，验证码为<span style="color: #f00;">';
			html += authCode;
			html += '</span>，30分钟内有效，若非本人操作，请尽快修改密码。</p>';
		User.update({username: req.query.username, email: req.query.email},
					{$set: {
						authcode: authCode,
						lastsendauthcodetime: Date.now()
					}}, function (err, result) {
						if(err){
							return next(err);
						}
						if(!result.nModified){
							return res.status(200).json({
								result: false,
								msg: '用户名或者邮箱不正确'
							})
						}
						mailer.send({
							to: req.query.email,
							subject: '找回密码',
							html: html,
							generateTextFromHtml: true
						}, function (err, info) {
							if(err){
								return res.status(200).json({
									result: false,
									msg: '邮件发送失败'
								});
							}
							return res.status(200).json({
								result: true,
								msg: '邮件发送成功，30分钟内有效，请尽快完成操作。'
							});
						});
					})
	},
	//重置密码
	findPwd: function (req, res, next) {
		User.findOne({username: req.body.username, email: req.body.email},function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(200).json({
					result: false,
					msg: '用户名或者邮箱不正确'
				});
			}
			if(user.authcode !== req.body.authCode){
				return res.status(200).json({
					result: false,
					msg: '验证码不正确'
				});
			}
			if(user.lastsendauthcodetime + 1800000 < Date.now()){
				return res.status(200).json({
					result: false,
					msg: '验证码已超时，请从新获取。'
				});
			}
			let salt = Math.round(new Date().getTime() * Math.random()) + '';
			user.password = req.body.newPwd;
			user.salt = salt;
			user.hashed_password = User.encryptoPassword(req.body.newPwd, salt);
			user.authcode = '';
			user.save(function (err) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true,
					msg: '密码重置成功'
				});
			})
		});
	},
	modifyAvatar: function (req, res, next) {
		function avatar (server, uploadFolderName, fileName) {
			let avatarUrl = 'http://' + server + '/' + uploadFolderName + '/' + fileName;
			User.update({_id: req.user._id}, 
						{$set: {
							avatar: avatarUrl
						}}, function (err, result) {
							if(err){
								return next(err);
							}
							if(!result.nModified){
								return next();
							}
							return res.status(200).json({
								result: true,
								msg: '修改成功',
								data: avatarUrl,
								token: tokenManage.createNewToken(req.user)
							});
						});
		}
		uploadfile.upload(req, res, next, avatar);
	},
	uploadFile: function (req, res, next) {
		function callback (server, uploadFolderName, fileName) {
			return res.status(200).end('http://' + server + '/' + uploadFolderName + '/' + fileName);
		}
		uploadfile.upload(req, res, next, callback);
	},
	basesettings: function (req, res, next) {
		User.findOne({email: req.body.email}, function (err, user) {
			if(err){
				return next(err);
			}
			if(user && user._id != req.user._id){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用'
				});
			}
			user.nickname = req.body.nickname;
			user.email = req.body.email;
			user.save(function (err, result) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true, 
					msg: '设置成功',
					token: tokenManage.createNewToken(result)
				});
			});
		})
	},
	persionalInfo: function (req, res, next) {
		User.findOne({_id: req.user._id}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return next();
			}
			user.sex = req.body.sex;
			user.bio = req.body.bio;
			user.url = req.body.url;
			user.save(function (err, result) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true, 
					msg: '设置成功',
					token: tokenManage.createNewToken(result)
				});
			});
		});
	},
	modifyPwd: function (req, res, next) {
		User.findOne({_id: req.user._id}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return next();
			}
			if(user.encryptoPassword(req.body.oldPwd) !== user.hashed_password){
				return res.status(200).json({
					result: false,
					msg: '原密码不正确'
				});
			}
			user.salt = Math.round(new Date().getTime() * Math.random()) + '';
			user.hashed_password = user.encryptoPassword(req.body.newPwd);
			user.save(function (err) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true,
					msg: '修改成功'
				})
			})
		})
	},
	deleteCount: function (req, res, next) {

	}
};