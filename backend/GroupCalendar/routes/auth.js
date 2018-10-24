var express = require('express');
var router = express.Router();


// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){
	console.log(req.params.id_token);

	// if(!req.body){
	// 	res.status(404).send('No request Found\n');
	// 	return console('Err: no request\n')
	// }

	// res.send('auth_post test');

 	auth_controller.auth_google(req, res);
 	
});

module.exports = router;
