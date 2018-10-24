var express = require('express');
var router = express.Router();

// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){
	if(req === null)
		res.status(404).send('no id_token found');

	console.log('Checking Google Auth');
	auth_controller.auth_google(req.body, auth_res);
	res(auth_res);
});

module.exports = router;
