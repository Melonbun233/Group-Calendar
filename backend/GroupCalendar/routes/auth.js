var express = require('express');
var router = express.Router();


// require controller modules
var authController = require('../controllers/authController');

/* GET users listing. */
router.post('/google', function(req, res){
	console.log(req.body);

	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request');
	}

 	authController.authGoogle(req, res);
 	
});

router.post('/app', function(req, res){
	console.log(req.body);

	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request');
	}

 	authController.authApp(req, res);
});

module.exports = router;