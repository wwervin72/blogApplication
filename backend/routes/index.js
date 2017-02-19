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
}