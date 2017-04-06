module.exports = {
	mongoDB: 'mongodb://localhost:8080/blog',
	port: 3000,
	redis: {
		port: 6379,
		token: {
			secret: 'ervinBlog',
			expireTime: 10
		},
		oauth: {
			expireTime: 60 * 30,
		}
	},
	// tokenSecret: 'ervinBlog',
	// tokenExpireTime: 60 * 30,
	// cookieSecret: 'myBlog',
	session: {
		key: 'myBlog',
		secret: 'myblog',
		maxAge: 30 * 60 * 1000,
		url: 'mongodb://localhost:8080/blog'
	}
};