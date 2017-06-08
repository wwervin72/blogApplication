let mongoose = require('mongoose');
let User = mongoose.model('User');
let Article = mongoose.model('Post');
let Comment = mongoose.model('Comment');
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
				return res.status(200).json({
					result: false,
					msg: '404 not found',
					code: 404
				});
				return next();
			}
			return next();
		});
	},
	login: function(req, res, next){
		if(req.body.username === '' || req.body.password === ''){
			return res.status(200).json({
					result: false,
					msg: '用户名或者密码为空',
					code: 200
				});
		}
		passport.authenticate('local', function(err, user, info){
			if(err){
				return next(err);
			}
			// 登陆失败
			if(!user){
				return res.status(200).json({
					result: false,
					msg: info.message,
					code: 500
				});
			}
			return res.status(200).json({
				result: true,
				msg: info.message,
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
				},
				code: 200
			});
		})(req, res, next);
	},
	// 注册发送邮箱验证
	registerSendAuthCode: function (req, res, next) {
		let email = req.query.email;
		if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)){
			return res.status(200).json({
				result: false,
				msg: '邮箱格式不正确',
				code: 200
			});
		}
		User.findOne({email: email}, function (err, user) {
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用',
					code: 200
				});
			}
			let authCode = createAuthCode();
			let html = '<p>你的邮箱<strong style="font-weight:bold;color:#f00;">，<strong style="color:#f00;text-decoration:underline;">';
				html += email;
				html += '</strong>正在进行注册账号的操作，验证码为<span style="color: #f00;">';
				html += authCode;
				html += '</span>，30分钟内有效。</p>';
			mailer.send({
					to: email,
					subject: '注册账号',
					html: html,
					generateTextFromHtml: true
				}, function (err, info) {
					console.log(err)
					if(err){
						return res.status(200).json({
							result: false,
							msg: '邮件发送失败',
							code: 500
						});
					}
					let authCodeInfo = {
						email: email,
						code: authCode
					};
					tokenManage.saveAuthCode(res, authCodeInfo);
				});
		});
	},
	// 用户注册
	register: function(req, res, next){
		let username = req.body.username;
		User.findOne({username: username}, function (err, result) {
			if(result){
				return res.status(200).json({
					result: false,
					msg: '该用户名已被占用',
					code: 200
				});
			}
			let user = new User(req.body);
			user.save((err, user) => {
				if(err) {
					let msg = {};

					Object.keys(err.errors).forEach(function (item) {
						msg[item === 'hashed_password' ? 'password' : item] = err.errors[item].message;
					});
					return res.status(200).json({
						result: false,
						msg: msg,
						code: 500
					});
				}
				// 过期掉验证码
				tokenManage.expireAuthCode(req.body.email);
				return res.status(200).json({
					result: true,
					msg: '注册成功',
					token: tokenManage.createNewToken(user),
					info: {
						_id: user._id,
						nickname: user.nickname,
						username: user.username,
						avatar: user.avatar,
						email: user.email,
						bio: user.bio,
						url: user.url,
						sex: user.sex
					},
					code: 200
				});
			});
		});
	},
	// 验证邮箱唯一性
	emailUnique: function (req, res, next) {
		let email = (req.body && req.body.email || req.query && req.query.email);
		User.findOne({email: email}, function (err, user) {
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用',
					code: 200
				});
			}
			return res.status(200).json({
				result: true,
				msg: '该邮箱可以使用',
				code: 200
			});
		});
	},
	// 验证用户名唯一性
	usernameUnique: function (argument) {
		let username = (req.body && req.body.username || req.query && req.query.username);
		User.findOne({username: username}, function (err, user) {
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该用户名可以使用',
					code: 200
				});
			}
			next();
		}); 
	},
	// 退出登陆
	signOut: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		tokenManage.expireAuthCode('token_' + req.user._id);
		delete req.user;
		return res.status(200).json({
			result: true,
			msg: '登出成功',
			code: 200
		});
	},
	// 获取用户信息
	getInfo: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
		return res.status(200).json({
			info: {
				_id: req.user._id,
				nickname: req.user.nickname,
				username: req.user.username,
				avatar: req.user.avatar,
				email: req.user.email,
				bio: req.user.bio,
				url: req.user.url,
				sex: req.user.sex
			},
			token: token,
			result: true,
			code: 200
		});
	},
	// 发送邮件（验证码）
	sendAuthCode: function (req, res, next) {
		let authCode = createAuthCode();
		let html = '<p>你的账号<strong style="font-weight:bold;color:#f00;">，<strong style="color:#f00;text-decoration:underline;">';
			html += req.query.username;
			html += '</strong>正在进行重置密码操作，验证码为<span style="color: #f00;">';
			html += authCode;
			html += '</span>，30分钟内有效。</p>';
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
								msg: '用户名或者邮箱不正确',
								code: 200
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
									msg: '邮件发送失败',
									code: 200
								});
							}
							return res.status(200).json({
								result: true,
								msg: '邮件发送成功，30分钟内有效，请尽快完成操作。',
								code: 200
							});
						});
					})
	},
	//重置密码
	findPwd: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
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
			let token = (req.query && req.query.token) || (req.body && req.body.token);
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
							req.user.avatar = avatarUrl;
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
		let token = (req.query && req.query.token) || (req.body && req.body.token);
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
					token: token
				});
			});
		})
	},
	persionalInfo: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
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
					token: token
				});
			});
		});
	},
	modifyPwd: function (req, res, next) {
		let token = (req.query && req.query.token) || (req.body && req.body.token);
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
					msg: '修改成功',
					token: token
				})
			})
		})
	},
	deleteCount: function (req, res, next) {
		// 需要删除账号  文章 文章下的评论 账号的评论
		// Promise.all([
		// 		User.remove({_id: req.user._id}).exec(),
		// 		Article.remove({author: req.user._id}).exec(),
		// 		Comment.remove({author: req.user._id}).exec()
		// 	],function (result) {

		// 	})
		User.remove({_id: req.user._id}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result.nModified){
				return res.status(200).json({
					result: false,
					msg: '删除失败'
				});
			}
			return res.status(200).json({
				result: true,
				msg: '删除成功，你需要从新登陆'
			});
		});
	}
};
// 生成验证码
function createAuthCode () {
	let str = 'abcdefghijklmnopqrstuvwxyz1234567890';
	let authCode = [];
	let codeLen = 6;
	while (codeLen) {
		authCode[authCode.length] = str.substr(Math.floor(Math.random() * 36), 1);
		codeLen--;
	}
	return authCode.join('');
}