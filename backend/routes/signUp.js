let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');
let checkUser = require('../utils/checks');

router.get('/', (req, res, next) => {
	res.render('signUp');
});

router.post('/', checkUser.checkLogin, userCtrl.register);

module.exports = router;