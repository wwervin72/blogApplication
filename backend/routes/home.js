let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let check = require('../utils/checks');
let tokenManage = require('../utils/tokenManage');

router.get('/', (req, res, next) => {
	res.render('home');
});

// 获取用户信息
router.get('/userinfo', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.getInfo);

// 获取验证码
router.get('/captcha', userCtrl.createCaptcha);

module.exports = router;