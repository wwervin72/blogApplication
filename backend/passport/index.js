let mongoose = require('mongoose');
let User = mongoose.model('User');
let local = require('./local');
let github = require('./github');

module.exports = function(passport){
	
	passport.serializeUser(function(user, done){
        return done(null, user.id);
    });

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(local);
	passport.use(github);
}