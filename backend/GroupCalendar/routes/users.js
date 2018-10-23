var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var user_controller = require('../controllers/userController');

const {check, validationResult} = require('express-validator/check');

/* GET users. */
router.get('/', 
	[check('user_email').isEmail()],
	function(req, res){
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			console.log(user_email);
			return res.status(400).json({error: "Invalid user name"});
		}
		user_controller.user_info_get(req.body, res);
	});

router.put('/', user_controller.user_info_put);
router.post('/', user_controller.user_id_post);
router.delete('/', user_controller.user_delete);

module.exports = router;
