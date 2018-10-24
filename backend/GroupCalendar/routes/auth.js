var express = require('express');
var router = express.Router();

// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){

	console.log('Checking Google Auth\n');

	if(req.body.length == 0){
		return res.status(404).send('No request Found\n');
	}

	// res.send('auth_post test');

 	auth_controller.auth_google(req.body, res);
 	
});

module.exports = router;
