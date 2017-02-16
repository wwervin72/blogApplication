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
app.use(require('cookie-parser')(config.cookieSecret));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./models/users');
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session())

require('./routes')(app, passport);

app.listen(config.port, () => {
	console.log('server is running at port ' + config.port);
});
