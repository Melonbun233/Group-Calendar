var express = require('express');
var router = express.Router();

// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/google', function(req, res){
	if(req === null)
		res.status(404).send('no id_token found');
	auth_controller.auth_google(req.id_token, res);
});

module.exports = router;
