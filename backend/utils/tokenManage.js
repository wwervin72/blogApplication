let redis = require('redis');
let config = require('config-lite');
let redisClient = redis.createClient(config.redis.port);

redisClient.on('error', function (err) {
	console.log('redis Error: ' + err);
});

redisClient.on('connect', function () {
	console.log('redis is ready');
});

module.exports = {
	verifyToken: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
		if(token == null){
			return res.status(401).json({
				result: false,
				msg: '没有token,请登录'
			});
		}
		redisClient.get(token, function (err, reply) {
			if(err){
				return res.status(500).json({
					result: false,
					msg: '服务器错误'
				});
			}
			if(reply){
				return res.status(401).json({
					result: false,
					msg: 'token失效, 请从新登陆'
				});
			}
			next();
		});
	},
	expireToken: function (token) {
		redisClient.set(token, {is_expire: true});
		redisClient.expire(token, config.redis.expireTime);
	}
}