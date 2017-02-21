module.exports = (app, passport) => {
	app.use('/register', require('./register'));
	app.use('/login', require('./login'));
	app.use('/logout', require('./logout'));
	app.use('/', require('./home'));
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', {
			failureRedirect: '/login'
		}), (req, res) => {
	  		res.redirect(req.session.returnTo || '/');
	});
	app.use(function (req, res, next) {
		return res.status(404).json({
			result: false,
			msg: '404 not found'
		});
	});
	app.use(function (err, req, res, next) {
		return res.status(200).json({
			result: false,
			msg: '500 server error'
		});
	});
}