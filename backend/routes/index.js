let tokenManage = require('../utils/tokenManage');

module.exports = (app, passport) => {
	app.use('/register', require('./register'));
	app.use('/login', require('./login'));
	app.use('/logout', require('./logout'));
	app.use('/', require('./home'));
	// github登陆
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', {
			failureRedirect: 'http://localhost/#!/500'
		}), (req, res) => {
		let user = req.user;
		// 登陆账号
		res.cookie('TOKEN', tokenManage.createNewToken(user), {domain: 'localhost', path: '/'});
		res.redirect('http://localhost/#!/a');

		// if(user.msg === 'need login local'){
		// 	return res.status(200).json({
		// 		result: false,
		// 		msg: 'need login local'
		// 	});
		// }
		// return res.status(200).json({
		// 	result: true,
		// 	msg: '登陆成功',
		// 	token: tokenManage.createNewToken(user),
		// 	info: {
		// 		username: user.username,
		// 		avatar: user.avatar,
		// 		nickname: user.nickname,
		// 		email: user.email,
		// 		_id: user._id,
		// 		bio: user.bio,
		// 		url: user.url,
		// 		sex: user.sex
		// 	}
		// });
	});
	app.use(function (req, res, next) {
		return res.status(404).json({
			result: false,
			msg: '404 not found'
		});
	});
	app.use(function (err, req, res) {
		return res.status(500).json({
			result: false,
			msg: '500 server error'
		});
	});
}