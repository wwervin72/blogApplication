let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');
let jwt = require('jsonwebtoken');

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
				let token = jwt.sign({
					data: user
				}, 'ervin', {expiresIn: 60 * 30});
				res.status(200);
				return res.json({
					result: true,
					msg: '登陆成功',
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
	}
};