let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let check = require('../utils/checks');
let tokenManage = require('../utils/tokenManage');

router.get('/', (req, res, next) => {
	res.render('home');
});

router.get('/userinfo', tokenManage.verifyToken, check.checkLogin, userCtrl.getInfo);

module.exports = router;