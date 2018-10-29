var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var user_controller = require('../controllers/userController');
//const {check, validationResult} = require('express-validator/check');
var validator = require('../middlewares/validation');
var jwt = require('../middlewares/jwt');

/* GET users. */
router.get('/', 
	validator.check,
	user_controller.user_info_get);

router.put('/', 
	jwt.verifyToken,
	validator.check,
	user_controller.user_info_put);

router.post('/', 
	validator.check,
	user_controller.user_create);

module.exports = router;
