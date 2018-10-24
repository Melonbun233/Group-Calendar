var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var user_controller = require('../controllers/userController');

const {check, validationResult} = require('express-validator/check');
//var temp = {"email" : "234@gmail.com"};

/* GET users. */
router.get('/', 
	check('user_email').isEmail(),
	function(req, res){
		//console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			return res.status(400).json({"error": "Invalid user name."});
		}
		user_controller.user_info_get(req.body, res);
	});

router.put('/', /*(req,res)=>{
	for (int i=0; i<req.length; i++){
		check()
	}*/
	user_controller.user_info_put
);
router.post('/', user_controller.user_id_post);
router.delete('/', user_controller.user_delete);

module.exports = router;
