const {check, param} = require('express-validator/check');

exports.checkParams = [
	param('user_email').isEmail()
]

exports.check = [
	check('user_email').isEmail()
]
