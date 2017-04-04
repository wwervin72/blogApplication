let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');

router.post('/', userCtrl.register);

//注册验证唯一性
// router.get('/unique', userCtrl.registerCheckUnique);

//注册发送邮件
router.get('/authCode', userCtrl.registerCheckUnique, userCtrl.registerSendAuthCode);

module.exports = router;