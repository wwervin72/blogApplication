let mongoose = require('mongoose');
let User = mongoose.model('User');
let githubStrategy = require('passport-github').Strategy;
let config = require('config-lite');

module.exports = new githubStrategy({
	clientID: config.github.clientID,
	clientSecret: config.github.clientSecret,
	callbackURL: config.github.callbackURL
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({github: profile.id}, (err, user) => {
		if(err){
			return done(err);
		}
		if(user){
			// 已经有账号和github绑定，直接使用该账号登陆
			return done(null, user);
		}
		// 没有和github绑定，需要验证github账号的邮箱是否被占用，如果占用则使用该账号登陆，否则新建账号并且更新账号信息
		User.findOne({email: profile._json.email}, (err, userEmail) => {
			if(err){
				return done(err);
			}
			if(userEmail){
				//该邮箱已被暂用，使用该邮箱绑定的账号登陆
				return done(null, userEmail);
			}else{
				// 没有该邮箱所绑定的账号，需要完善个人信息
				let user = new User({
					username: profile._json.login,
					nickname: profile._json.name,
					email: profile._json.email,
					github: profile._json.id,
					avatar: profile._json.avatar_url,
					url: profile._json.blog,
					provider: profile.provider
				});
				user.save(function (err, user) {
					if(err){
						return done(err);
					}
					return done(null, user);
				})			
			}
		});
	});
});