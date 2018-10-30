var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var user_controller = require('../controllers/userController');
const url = require('url');  
const querystring = require('querystring');

const {check, validationResult} = require('express-validator/check');
//var temp = {"email" : "234@gmail.com"};

/* GET users. */
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

router.put('/', (req,res)=>{
	/*
	if (req.body.has('user_id'))
		check('user_id').isNumeric();
	if (req.body.has('user_name'))
		check('user_name').isLength({max:50});
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid info to update."});
	}*/
	var parsedUrl = url.parse(req.originalUrl);  
	console.log(parsedUrl);
	var parsedQ = querystring.parse(parsedUrl.query);
	console.log(parsedQ);
	userController.userInfoPut(parsedQ, res);
	//console.log("put ends");

});

router.post('/', userController.userIdPost);
router.delete('/', userController.userDelete);

module.exports = router;
