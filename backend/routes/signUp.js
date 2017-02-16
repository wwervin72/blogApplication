let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let tokenManage = require('../utils/tokenManage');

router.get('/', (req, res, next) => {
	res.render('signUp');
});

router.post('/', tokenManage.verifyToken, userCtrl.register);

module.exports = router;