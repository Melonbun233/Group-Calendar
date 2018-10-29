const {check} = require('express-validator/check');

exports.check = [
	check('user_email').isEmail()
]