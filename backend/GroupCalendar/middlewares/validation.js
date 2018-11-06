const {check, param} = require('express-validator/check');

exports.checkParams = [
	param('userEmail').isEmail()
]

exports.check = [
	check('userEmail').isEmail()
]
