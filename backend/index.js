let express = require('express');
let mongoose = require('mongoose');
let join = require('path').join;
let session = require('express-session');
let mongoStore = require('connect-mongo')(session);
let config = require('config-lite');
let passport = require('passport');
let bodyParser = require('body-parser');
let app = express();

app.set('views', join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'public')));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

connectMongoDB()
	.on('error', console.log)
	.on('disconnected', connectMongoDB)
	.once('open', listen);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	name: config.session.key,
	secret: config.session.secret,
	cookie: {
		maxAge: config.session.maxAge
	},
	store: new mongoStore({
		url: 'mongodb://localhost:8080/myBlog'
	})
}));

require('./models/users');
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session())


require('./routes')(app, passport);

function connectMongoDB (argument) {
	mongoose.Promise = global.Promise;
	return mongoose.connect(config.mongoDB).connection;
}

function listen () {
	app.listen(config.port, () => {
		console.log('server is running at port ' + config.port);
	});
}