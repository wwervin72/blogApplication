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
router.get('/userinfo', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.getInfo);

//用户找回密码, 发送邮件
router.get('/pwd/authcode', userCtrl.sendResetPwdAuthCode);

//重置密码
router.put('/pwd', tokenManage.verifyAuthCode, userCtrl.findPwd);

// 获取所有文章
router.get('/posts', articleCtrl.getAllPost);

// 获取最新文章的点赞排行榜
router.get('/newheartarticle', articleCtrl.getHeartArticle);

// 获取最新文章的阅读排行榜
router.get('/newviewtarticle', articleCtrl.getViewArticle);

//获取具体某篇文章
router.get('/article', articleCtrl.findArticleById);

// 获取tag下的文章
router.get('/tag/articles', articleCtrl.getTagArticles);

//获取文章下的评论
router.get('/comments', commentCtrl.getArticleComments);

// 获取用户的信息
router.get('/user', userCtrl.getUserInfoByName);

//获取用户的文章
router.get('/user/posts', userCtrl.findUserByName, articleCtrl.getUserPosts);

//获取用户的收藏文章
router.get('/user/collections', articleCtrl.getCollections);

// 修改用户头像
router.post('/user/avatar', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.modifyAvatar);

//用户基础设置
router.put('/user/basesettings', tokenManage.verifyToken, tokenManage.verifyRedis, tokenManage.verifyAuthCode, userCtrl.basesettings);

// 用户重置邮箱，获取验证码
router.put('/user/persionalInfo/email', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.sendResetEmailAuthCode);

//用户个人资料设置
router.put('/user/persionalInfo', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.persionalInfo);

//用户修改密码
router.put('/user/pwd', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.modifyPwd);

//用户删除账号
router.delete('/user/count', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.deleteCount);

// 用户关注作者
router.post('/user/attention', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.focusOn);

// 用户取消关注
router.put('/user/attention', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.cancelFocusOn);

//上传文件
router.post('/upload', userCtrl.uploadFile);


// 用户添加文章
router.post('/user/article', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.createPost);

//上传图片
router.post('/user/img', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.createImg);

// 用户删除文章
router.delete('/user/article', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.deleteArticle);

// 用户收藏文章
router.post('/user/article/collection', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.collectedArticle);

// 用户获取收藏的文章
router.get('/user/article/collection', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.getCollectedArticle);

// 用户收藏文章
router.delete('/user/article/collection', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.cancelCollectedArticle);

// 更新文章
router.put('/user/article', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.update);

//点赞文章
router.get('/article/heart', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.heart);

//反对文章
router.get('/article/stamp', tokenManage.verifyToken, tokenManage.verifyRedis, articleCtrl.stamp);

//评论文章
router.post('/article/comment', tokenManage.verifyToken, tokenManage.verifyRedis, commentCtrl.createComment);

// 修改评论
router.put('/article/comment', tokenManage.verifyToken, tokenManage.verifyRedis, commentCtrl.updateComment);

// 删除评论
router.delete('/article/comment', tokenManage.verifyToken, tokenManage.verifyRedis, commentCtrl.deleteComment);

// 点赞评论
router.get('/comment/heart', tokenManage.verifyToken, tokenManage.verifyRedis, commentCtrl.heart);

// 反对评论
router.get('/comment/stamp', tokenManage.verifyToken, tokenManage.verifyRedis, commentCtrl.stamp);

module.exports = router;