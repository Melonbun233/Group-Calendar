var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var userController = require('../controllers/userController');
const url = require('url');  
var validator = require('../middlewares/validation');
/*
router.get('/', 
	check('userEmail').isEmail(),
	function(req, res){
		console.log(req.param('userEmail'));
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			return res.status(400).json({error: 'Invalid user name.'});
		}
		user_controller.userInfoGet(req.param('userEmail'), res);
	});
*/

router.put('/', 
	validator.check,
	userController.userInfoPut);

router.post('/',
	(req, res, next) => { 
		/* since the validator cannot find userEmail in body, we 
		need to put all json into req.param for the validator to check*/
		Object.assign(req.params, req.body.profile, req.body.user);
		next();
	}, 
	validator.checkParams,
	userController.userCreate);

router.delete('/', userController.userDelete);

module.exports = router;
