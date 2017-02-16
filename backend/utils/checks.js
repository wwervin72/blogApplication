let jwt = require('jsonwebtoken'); 

module.exports = {
	checkLogin: function (req, res, next) {
		let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];;
		if(token){
			jwt.verify(token, 'ervin', function (err, decode) {
				if(err){
					return res.status(200).json({
						result: false,
						msg: 'token错误, 请从新登陆'
					});
				}else{
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
		}else{
			return res.status(200).json({
				result: false,
				msg: '没有token, 请登录'
			});
		}
	},
	checkNotLogin: function (req, res, next) {
		
	}
}