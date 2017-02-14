let mongoose = require('mongoose');
let localStrategy = require('passport-local').Strategy;
let User = mongoose.model('User');

module.exports = new localStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, done) => {
	User.findOne({username: username}, (err, user) => {
		if(err){
			// res.status(200);
			// res.json({
			// 	result: false,
			// 	msg: '服务器错误'
			// });
			return done(err);
		}
		if(!user){
			// res.status(200);
			// res.json({
			// 	result: false,
			// 	msg: '用户名不存在'
			// });
			return done(null, false, {message: '用户名不存在'});
		}
		if(user.authenticate(password)){
			// res.status(200);
			// res.json({
			// 	result: false,
			// 	msg: '登陆成功'
			// });
			return done(null, user, {message: '登陆成功'});
		}else{
			// res.status(200);
			// res.json({
			// 	result: false,
			// 	msg: '用户名或者密码不正确'
			// });
			return done(null, false, {message: '用户名或者密码不正确'});
		}
	})
})