let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let tokenManage = require('../utils/tokenManage');

router.get('/', (req, res, next) => {
	res.render('signUp');
});

router.post('/', userCtrl.register);

//注册验证唯一性
router.get('/unique', userCtrl.registerCheckUnique)

module.exports = router;