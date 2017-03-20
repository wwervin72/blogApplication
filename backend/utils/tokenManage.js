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
	// 检测是否传入了token, 和redis是否有token这个属性(token是否失效)
	verifyRedis: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		// 没有token需要从新登陆
		if(token == null){
			return res.status(200).json({
				result: false,
				msg: '没有token, 请登录'
			});
		}
		redisClient.get(token, function (err, reply) {
			if(err){
				return res.status(500).json({
					result: false,
					msg: '服务器错误'
				});
			}
			//如果redis里存在该token的属性，那么说明该token已失效了
			if(reply){
				return res.status(200).json({
					result: false,
					msg: 'token失效, 请从新登陆'
				});
			}
			// 并没有检测token是否正确
			next();
		});
	},
	//检测token是否正确
	verifyToken: function (req, res, next) {
		let _this = this;
		let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];;
		jwt.verify(token, config.tokenSecret, function (err, decode) {
			if(err){
				// token是错误的
				return res.status(200).json({
					result: false,
					msg: 'token错误, 请从新登陆'
				});
			}else{
				// token过期
				if(Date.now() > decode.exp * 1000){
					return res.status(200).json({
						result: false,
						msg: 'token过期, 请从新登陆'
					});
				}
				req.user = decode;
				next();
			}
		});
	},
	// 每次进行需要token的请求，都会返回新的token，把之前旧的token删除掉
	createNewToken: function (user) {
		let token = jwt.sign({
			_id: user._id,
			username: user.username,
			nickname: user.nickname,
			avatar: user.avatar,
			email: user.email,
			bio: user.bio,
			sex: user.sex,
			url: user.url,
			// 用来生成不同的token，因为如果同一用户在一秒内连续请求，生成的token是一样的。需要一个一直变化的值来生成变化的token
			variable: new Date().getTime()
		}, config.tokenSecret, {expiresIn: config.tokenExpireTime});
		return token;
	},
	expireToken: function (token) {
		redisClient.set(token, {is_expired: true}, redis.print);
		redisClient.expire(token, config.redis.expireTime);
	}
}