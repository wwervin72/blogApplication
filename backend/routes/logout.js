let express = require('express');
let router = express.Router();
let tokenManage = require('../utils/tokenManage');
let userCtrl = require('../controllers/user.controlelr');

router.get('/', tokenManage.verifyToken, tokenManage.verifyRedis, userCtrl.signOut);

module.exports = router;