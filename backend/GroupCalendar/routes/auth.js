var express = require('express');
var router = express.Router();


// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){

	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request')
	}

 	auth_controller.auth_google(req.body, res);
 	
});

module.exports = router;
