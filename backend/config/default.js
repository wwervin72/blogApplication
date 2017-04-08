module.exports = {
	mongoDB: 'mongodb://localhost:8080/blog',
	port: 3000,
	redis: {
		port: 6379,
		token: {
			secret: 'ervinBlog',
			expireTime: 60 * 60 * 24 * 365
		},
		oauth: {
			expireTime: 60 * 30,
		}
	}
};