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
	// 检测redis是否有token，没有则过期，有则刷新过期时间
	verifyRedis: function (req, res, next) {
		redisClient.get('token_' + req.user._id, function (err, reply) {
			if(err){
				return next(err);
			}
			if(reply){
				// 刷新token
				redisClient.expire('token_' + req.user._id, config.redis.token.expireTime);
				return next();
			}
			return res.status(200).json({
				result: false,
				msg: 'token过期，请从新登陆'
			});
		});
	},	
	// 检测是否传入了token，并且解析token
	verifyToken: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];;
		// 没有token需要从新登陆
		if(!token){
			return res.status(200).json({
				result: false,
				msg: '没有token, 请登录'
			});
		}
		jwt.verify(token, config.redis.token.secret, function (err, decode) {
			if(err){
				// token是错误的
				return res.status(200).json({
					result: false,
					msg: 'token错误'
				});
			}else{
				req.user = decode;
				return next();
			}
		});
	},
	// 生成token，并且存储在redis中
	createNewToken: function (user) {
		let key = 'token_' + user._id;
		let token = jwt.sign({
			_id: user._id,
			username: user.username,
			nickname: user.nickname,
			avatar: user.avatar,
			email: user.email,
			bio: user.bio,
			sex: user.sex,
			url: user.url,
			collections: user.collections,
			attentions: user.attentions,
			fans: user.fans
		}, config.redis.token.secret);
		redisClient.set(key, token, redisClient.print);
		redisClient.expire(key, config.redis.token.expireTime);
		return token;
	},
	saveAuthCode: function (res, codeInfo) {
		redisClient.set(codeInfo.authCodeTitle, codeInfo.code, function (err) {
			if(err){
				return res.status(200).json({
					result: false,
					msg: '验证码保存失败，请从新发送'
				});
			}
			return res.status(200).json({
				result: true,
				msg: '邮件发送成功，' + (codeInfo.timeout || config.redis.oauth.expireTime / 60) + '分钟内有效。'
			});
		});
		redisClient.expire(codeInfo.authCodeTitle, codeInfo.timeout || config.redis.oauth.expireTime);
	},
	verifyAuthCode: function (req, res, next) {
		let authCode = (req.body && req.body.authcode) || (req.query && req.query.authcode);
		let authcodetitle = (req.body && req.body.authcodetitle) || (req.query && req.query.authcodetitle);
		if(!authCode){
			return res.status(200).json({
				result: false,
				msg: '请输入验证码'
			});
		}
		redisClient.get(authcodetitle, function (err, code) {
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
	refreshToken: function (user, token) {
		redisClient.expire('token_' + user._id, config.redis.token.expireTime);
	},
	// 删除key
	expireAuthCode: function (key) {
		redisClient.expire(key, 0);
	}
}