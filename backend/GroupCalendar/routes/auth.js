var express = require('express');
var router = express.Router();


// require controller modules
var authController = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){

	if(req === null){
		res.status(400).send('No request Found');
		return console('Err: no request')
	}

 	authController.authGoogle(req.body, res);
 	
});

module.exports = router;
