let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let articleCtrl = require('../controllers/post.controller');
let commentCtrl = require('../controllers/comment.controller');
let check = require('../utils/checks');
let tokenManage = require('../utils/tokenManage');
let uploadFile = require('../utils/uploadFile');

router.get('/', (req, res, next) => {
	res.render('home');
});

// 获取用户信息
router.get('/userinfo', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.getInfo);

//用户找回密码, 发送邮件
router.get('/pwd/authCode', userCtrl.sendAuthCode);

//重置密码
router.put('/pwd', userCtrl.findPwd);

// 获取验证码
router.get('/captcha', userCtrl.createCaptcha);

// 获取所有文章
router.get('/posts', articleCtrl.getAllPost);

//获取具体某篇文章
router.get('/article', articleCtrl.findArticleById);

//获取文章下的评论
router.get('/comments', commentCtrl.getArticleComments);

//获取用户的文章
router.get('/user/posts', userCtrl.findUserByName, articleCtrl.getUserPosts);

// 修改用户头像
router.post('/user/avatar', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.modifyAvatar);

//用户基础设置
router.put('/user/basesettings', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.basesettings);

//用户个人资料设置
router.put('/user/persionalInfo', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.persionalInfo);

//用户修改密码
router.put('/user/pwd', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.modifyPwd);

//用户删除账号
router.delete('/user/count', tokenManage.verifyRedis, tokenManage.verifyToken, userCtrl.basesettings);


//上传文件
router.post('/upload', userCtrl.uploadFile);

// 用户添加文章
router.post('/user/article', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.createPost);

// 用户删除文章
router.delete('/user/article', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.deleteArticle);

// 更新文章
router.put('/user/article', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.update);

//点赞文章
router.get('/article/heart', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.heart);

//反对文章
router.get('/article/stamp', tokenManage.verifyRedis, tokenManage.verifyToken, articleCtrl.stamp);

//评论文章
router.post('/article/comment', tokenManage.verifyRedis, tokenManage.verifyToken, commentCtrl.createComment);

// 修改评论
router.put('/article/comment', tokenManage.verifyRedis, tokenManage.verifyToken, commentCtrl.updateComment);

// 删除评论
router.delete('/article/comment', tokenManage.verifyRedis, tokenManage.verifyToken, commentCtrl.deleteComment);

// 点赞评论
router.get('/comment/heart', tokenManage.verifyRedis, tokenManage.verifyToken, commentCtrl.heart);

// 反对评论
router.get('/comment/stamp', tokenManage.verifyRedis, tokenManage.verifyToken, commentCtrl.stamp);

module.exports = router;