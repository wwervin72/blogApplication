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
		if(req.body.username.trim() === '' || req.body.password.trim()  === ''){
			return res.status(200).json({
					result: false,
					msg: '用户名或者密码为空'
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
					msg: info.message
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
					sex: user.sex,
					attentions: user.attentions,
					fans: user.fans
				}
			});
		})(req, res, next);
	},
	// 注册账号发送邮箱验证
	registerSendAuthCode: function (req, res, next) {
		let email = req.query.email;
		if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)){
			return res.status(200).json({
				result: false,
				msg: '邮箱格式不正确'
			});
		}
		User.findOne({email: email}, function (err, user) {
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用'
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
					if(err){
						return res.status(500);
					}
					let authCodeInfo = {
						authCodeTitle: 'register-' + email,
						code: authCode
					};
					tokenManage.saveAuthCode(res, authCodeInfo);
				});
		});
	},
	// 用户注册
	register: function(req, res, next){
		let username = req.body.username.trim(),
			email = req.body.email.trim(),
			password = req.body.password.trim(),
			nickname = req.body.nickname.trim();
		User.findOne({username: username}, function (err, result) {
			if(result){
				return res.status(200).json({
					result: false,
					msg: '该用户名已被占用',
					code: 200
				});
			}
			let user = new User({
				username: username,
	            email: email,
	            password: password,
	            nickname: nickname
			});
			user.save((err, user) => {
				if(err) {
					let msg = {};

					Object.keys(err.errors).forEach(function (item) {
						msg[item === 'hashed_password' ? 'password' : item] = err.errors[item].message;
					});
					return res.status(200).json({
						result: false,
						msg: msg
					});
				}
				// 过期掉验证码
				tokenManage.expireAuthCode('register-' + req.body.email);
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
						sex: user.sex,
						attentions: user.attentions,
						fans: user.fans
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
					msg: '该邮箱已被占用'
				});
			}
			return res.status(200).json({
				result: true,
				msg: '该邮箱可以使用'
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
		User.findOne({_id: req.user._id})
			.populate('attentions', ['_id','username','nickname', 'avatar'])
			.populate('fans', ['_id','username','nickname', 'avatar'])
			.exec((err, user) =>{
				if(err){
					return next(err);
				}
				if(!user){
					return next();
				}
				return res.status(200).json({
					info: {
						_id: user._id,
						nickname: user.nickname,
						username: user.username,
						avatar: user.avatar,
						email: user.email,
						bio: user.bio,
						url: user.url,
						sex: user.sex,
						attentions: user.attentions,
						fans: user.fans
					},
					token: token,
					result: true
				});
			});
	},
	/**
	 * 根据账号获取信息
	 * @return {[type]} [description]
	 */
	getUserInfoByName (req, res, next) {
		let username = (req.body && req.body.username) || (req.query && req.query.username);
		if(!username){
			return res.status(200).json({
				result: false,
				msg: '没有用户名'
			});
		}
		User.findOne({username: username})
			.populate('attentions', ['_id','username','nickname', 'avatar'])
			.populate('fans', ['_id','username','nickname', 'avatar'])
			.exec((err, user) => {
				if(err){
					return next(err);
				}
				if(!user){
					return next();
				}
				Article.count({
					author: user._id
				}, (err, articles) => {
					if(err){
						return res.status(500).json({
							result: false,
							msg: '服务器错误'
						});
					}
					return res.status(200).json({
						result: true,
						info: {
							_id: user._id,
							nickname: user.nickname,
							avatar: user.avatar,
							attentions: user.attentions,
							fans: user.fans,
							articles: articles
						}
					})
				})
			}); 
	},
	// 发送邮件（重置密码验证码）
	sendResetPwdAuthCode: function (req, res, next) {
		let authCode = createAuthCode();
		let html = '<p>你的账号<strong style="color:#f00;text-decoration:underline;">';
			html += req.query.username;
			html += '</strong>正在进行重置密码操作，验证码为<span style="color: #f00;">';
			html += authCode;
			html += '</span>，30分钟内有效。</p>';
		let email = req.query.email;
		User.findOne({username: req.query.username, email: email},
					function (err, result) {
						if(err){
							return next(err);
						}
						if(!result){
							return res.status(200).json({
								result: false,
								msg: '用户名或者邮箱不正确',
								code: 200
							});
						}
						mailer.send({
							to: email,
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
							let authCodeInfo = {
								authCodeTitle: 'resetPwd-' + email,
								code: authCode
							};
							tokenManage.saveAuthCode(res, authCodeInfo);
							return;
						});
					});
	},
	//重置密码
	findPwd: function (req, res, next) {
		User.findOne({username: req.query.username, email: req.query.email},function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(200).json({
					result: false,
					msg: '用户名或者邮箱不正确'
				});
			}
			let salt = Math.round(new Date().getTime() * Math.random()) + '';
			user.password = req.body.newPwd;
			user.salt = salt;
			user.hashed_password = User.encryptoPassword(req.body.newPwd, salt);
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
	sendResetEmailAuthCode (req, res, next) {
		let authCode = createAuthCode();
		let email = req.query.email,
			username = req.user.username;
		let html = `<p>你的邮箱<strong>${email}</strong>正在进行绑定账号操作, 绑定账号为<strong>${username}</strong>, 验证码为${authCode}, 30分钟内有效。<p>`;
		User.findOne({email: email}, function (err, user) {
			if(user){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用, 请更换绑定邮箱',
					code: 200
				});
			}
			mailer.send({
				to: email,
				subject: '绑定邮箱',
				html: html,
				generateTextFromHtml: true
			}, function (err, info) {
				if(err){
					return res.status(200).json({
						result: false,
						msg: '邮件发送失败',
						code: 500
					});
				}
				let authCodeInfo = {
					authCodeTitle: 'resetEmail-' + email,
					code: authCode
				};
				tokenManage.saveAuthCode(res, authCodeInfo);
			});
		})
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
		User.findOne({email: req.query.email}, function (err, user) {
			if(err){
				return next(err);
			}
			if(user && user._id != req.user._id){
				return res.status(200).json({
					result: false,
					msg: '该邮箱已被占用'
				});
			}
			user.nickname = req.query.nickname;
			user.email = req.query.email;
			user.save(function (err, result) {
				if(err){
					return next(err);
				}
				// 过期掉验证码
				tokenManage.expireAuthCode('resetEmail-' + req.query.email);
				return res.status(200).json({
					result: true, 
					msg: '设置成功',
					token: tokenManage.createNewToken(user),
					info: {
						email: user.email,
						nickname: user.nickname
					}
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
			user.sex = req.query.sex;
			user.bio = req.query.bio;
			user.url = req.query.url;
			user.save(function (err, result) {
				if(err){
					return next(err);
				}
				return res.status(200).json({
					result: true, 
					msg: '设置成功',
					token: tokenManage.createNewToken(user),
					info: {
						sex: user.sex,
						bio: user.bio,
						url: user.url
					}
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
					msg: '密码修改成功, 你需要从新登陆, 3秒后跳转到登陆页面'
				})
			})
		})
	},
	// 关注
	focusOn (req, res, next) {
		let author = (req.body && req.body.author) || (req.query && req.query.author);
		if(!author){
			return res.status(200).json({
				msg: '没有要关注的作者',
				result: false
			});
		}
		if(author === req.user._id){
			return res.status(200).json({
				msg: '不能自己关注自己',
				result: false
			});
		}
		User.findOne({_id: req.user._id}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(200).json({
					msg: '请登录',
					result: false
				});
			}
			let attentions = user.attentions.some(item => {
				return item === author;
			});
			if(attentions){
				return res.status(200).json({
					msg: '你已经关注他了',
					result: false
				});
			}
			User.findOne({_id: author}, function (err, ahr) {
				if(err){
					return next(err);
				}
				if(!ahr){
					return res.status(200).json({
						msg: '你要关注的人不存在',
						result: false
					});
				}
				user.attentions.push(author);
				ahr.fans.push(req.user._id);
				user.save((err, result) => {
					if(err){
						return next(err);
					}
					ahr.save((err, ret) => {
						if(err){
							return next(err);
						}
						return res.status(200).json({
							msg: '关注成功',
							result: true,
							token: tokenManage.createNewToken(user),
						});
					});
				});
			});
		});
	},
	// 取消关注
	cancelFocusOn (req, res, next) {
		let author = (req.body && req.body.author) || (req.query && req.query.author);
		if(!author){
			return res.status(200).json({
				msg: '没有要取消关注的作者',
				result: false
			});
		}
		User.findOne({_id: req.user._id}, function (err, user) {
			if(err){
				return next(err);
			}
			if(!user){
				return res.status(200).json({
					msg: '请登录',
					result: false
				});
			}
			User.findOne({_id: author}, function (error, ahr) {
				if(error){
					return next(error);
				}
				if(!ahr){
					return res.status(200).json({
						msg: '你要取消关注的人不存在',
						result: false
					});
				}
				let fan, attention;
				ahr.fans.forEach((item, i) => {
					if(item === req.user._id) {
						fan = i;
					}
				});
				user.attentions.forEach((ele, index) => {
					if(ele === author) {
						attention = index;
					}
				});
				if(fan === undefined || attention === undefined){
					return res.status(200).json({
						msg: '你还没有关注他呢',
						result: false
					});
				}
				user.attentions.splice(attention, 1);
				ahr.fans.splice(fan, 1);
				user.save((er, result) => {
					if(er){
						return next(er);
					}
					ahr.save((er, ret) => {
						if(er){
							return next(er);
						}
						return res.status(200).json({
							msg: '取消关注成功',
							result: true,
							token: tokenManage.createNewToken(user),
						});
					});
				});
			});
		});
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