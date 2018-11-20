var express = require('express');
var router = express.Router();


// require controller modules
var authGooggleController = require('../controllers/authGoogleController');
var authAppController = require('../controllers/authAppController');

/* GET users listing. */
router.post('/google', function(req, res){

	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request')
	}

 	authGoogleController.authGoogle(req.body, res);
 	
});

router.post('/app', function(req, res){
	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request')
	}

 	authAppController.authApp(req.body, res);
});

module.exports = router;
