var express = require('express');
var router = express.Router();

// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){

	console.log('Checking Google Auth');

	if(req === null)
		res.status(404).send('No id_token Found');

	// res.send('auth_post test');
 	auth_controller.auth_google(req.body, auth_res);
 	res.status(200).jason(auth_res);
});

module.exports = router;
