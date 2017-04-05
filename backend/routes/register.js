let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let tokenManage = require('../utils/tokenManage');

// 注册
router.post('/', tokenManage.verifyAuthCode, userCtrl.register);

// 注册发送邮件
router.get('/authCode', userCtrl.registerSendAuthCode);

module.exports = router;