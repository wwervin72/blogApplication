let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');

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
				res.status(200);
				return res.json({
					result: true,
					msg: '登陆成功',
					token: ''
				});
			});
		})(req, res, next);
	},
	register: (req, res, next) => {
		let user = new User(req.body);
		user.save((err, user) => {
			if(err) {
				return next(err);
			}
			res.redirect('/');
		})
	}
};