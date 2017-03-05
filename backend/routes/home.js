let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let articleCtrl = require('../controllers/post.controller');
let check = require('../utils/checks');
let tokenManage = require('../utils/tokenManage');
let uploadFile = require('../utils/uploadFile');

router.get('/', (req, res, next) => {
	res.render('home');
});

// 获取用户信息
router.get('/userinfo', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.getInfo);

// 获取验证码
router.get('/captcha', userCtrl.createCaptcha);

// 获取所有文章
router.get('/posts', articleCtrl.getAllPost);

//获取具体某篇文章
router.get('/article', articleCtrl.findArticleById);

//获取用户的文章
router.get('/user/posts', userCtrl.findUserByName, articleCtrl.getUserPosts);

//上传文件
router.post('/upload', uploadFile.upload);

// 用户添加文章
router.post('/user/post', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.createPost);

// 更新文章
router.put('/update/article', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.update);

//点赞文章
router.get('/article/heart', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.heart);

//反对文章
router.get('/article/stamp', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.stamp);

module.exports = router;