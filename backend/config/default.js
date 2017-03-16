module.exports = {
	mongoDB: 'mongodb://localhost:8080/blog',
	port: 3000,
	redis: {
		port: 6379,
		expireTime: 60 * 30
	},
	tokenSecret: 'ervinBlog',
	tokenExpireTime: 60 * 30,
	cookieSecret: 'myBlog',
	email: {

	},
	session: {
		key: 'myBlog',
		secret: 'myblog',
		maxAge: 30 * 60 * 1000,
		url: 'mongodb://localhost:8080/blog'
	},
	github: {
		clientID: '90189950634776bd6a86',
		clientSecret: '8c724997ce2685ea372dfba9e971778ddf2971aa',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	}
};