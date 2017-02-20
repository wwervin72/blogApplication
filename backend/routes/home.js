let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let postCtrl = require('../controllers/post.controller');
let check = require('../utils/checks');
let tokenManage = require('../utils/tokenManage');

router.get('/', (req, res, next) => {
	res.render('home');
});

// 获取用户信息
router.get('/userinfo', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.getInfo);

// 获取验证码
router.get('/captcha', userCtrl.createCaptcha);

// 获取所有文章
router.get('/posts', postCtrl.getAllPost);

//获取用户的文章
router.get('/user/posts', postCtrl.getUserPosts);

module.exports = router;