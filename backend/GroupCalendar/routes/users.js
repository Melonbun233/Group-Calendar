var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var user_controller = require('../controllers/userController');

const {check, validationResult} = require('express-validator/check');
var temp = {"email" : "@gmail.com"};

/* GET users. */
router.get('/', 
	[check(temp).isEmail()],
	function(req, res){
		console.log(temp.email);
		const errors = validationResult(temp.email);
		if (!errors.isEmpty()){
			//console.log(errors);
			return res.status(400).json({"error": "Invalid user name"});
		}
		user_controller.user_info_get(temp.email, res);
	});

router.put('/', user_controller.user_info_put);
router.post('/', user_controller.user_id_post);
router.delete('/', user_controller.user_delete);

module.exports = router;
