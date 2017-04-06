let redis = require('redis');
let config = require('config-lite');
let redisClient = redis.createClient(config.redis.port);
let jwt = require('jsonwebtoken');

redisClient.on('error', function (err) {
	console.log('redis Error: ' + err);
});

redisClient.on('connect', function () {
	console.log('redis is ready');
});

module.exports = {
	// 检测是否传入了token, 和redis是否有token，没有则过期
	verifyRedis: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		// 没有token需要从新登陆
		if(!token){
			return res.status(200).json({
				result: false,
				msg: '没有token, 请登录'
			});
		}
		redisClient.get(token, function (err, reply) {
			if(err){
				return next(err);
			}
			if(reply){
				return next();
			}
			return res.status(200).json({
				result: false,
				msg: 'token错误，请从新登陆'
			});
		});
	},	
	// 解析token
	verifyToken: function (req, res, next) {
		let _this = this;
		let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];;
		jwt.verify(token, config.token.secret, function (err, decode) {
			if(err){
				// token是错误的
				return res.status(200).json({
					result: false,
					msg: 'token错误'
				});
			}else{
				// token过期
				// if(Date.now() > decode.exp * 1000){
				// 	return res.status(200).json({
				// 		result: false,
				// 		msg: 'token过期, 请从新登陆'
				// 	});
				// }
				req.user = decode;
				next();
			}
		});
	},
	// 生成token，并且存储在redis中
	createNewToken: function (user) {
		let token = jwt.sign({
			_id: user._id,
			username: user.username,
			nickname: user.nickname,
			avatar: user.avatar,
			email: user.email,
			bio: user.bio,
			sex: user.sex,
			url: user.url
			// 用来生成不同的token，因为如果同一用户在一秒内连续请求，生成的token是一样的。需要一个一直变化的值来生成变化的token
			// variable: new Date().getTime()
		}, config.token.secret);
		redisClient.set(token, 'login_token', redisClient.print);
		redisClient.expire(token, config.token.expireTime);
		return token;
	},
	saveAuthCode: function (res, codeInfo) {
		redisClient.set(codeInfo.email, codeInfo.code, function (err) {
			if(err){
				return res.status(200).json({
					result: false,
					msg: '验证码保存失败，请从新发送'
				});
			}
			return res.status(200).json({
				result: true,
				msg: '邮件发送成功，三十分钟内有效。'
			});
		});
		redisClient.expire(codeInfo.email, config.redis.oauth.expireTime);
	},
	verifyAuthCode: function (req, res, next) {
		let authCode = (req.body && req.body.authCode) || (req.query && req.query.authCode);
		let email = (req.body && req.body.email) || (req.query && req.query.email);
		if(!authCode){
			return res.status(200).json({
				result: false,
				msg: '请输入验证码'
			});
		}
		redisClient.get(email, function (err, code) {
			if(!code){
				return res.status(200).json({
					result: false,
					msg: '验证码已过期'
				});
			}
			if(code !== authCode){
				return res.status(200).json({
					result: false,
					msg: '验证码不正确'
				});
			}
			if(code === authCode){
				return next();
			}
		})
	},
	// 刷新token
	refreshToken: function (token) {
		redisClient.expire(token, config.redis.expireTime);
	},
	// 删除key
	expireAuthCode: function (key) {
		redisClient.expire(key, 0);
	}
}