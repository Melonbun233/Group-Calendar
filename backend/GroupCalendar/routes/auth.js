var express = require('express');
var router = express.Router();

// require controller modules
var auth_controller = require('../controllers/authGoogleController');

/* GET users listing. */
router.post('/auth/google', function(req, res){
	if(req === null)
		res.status(404).send('no idtoken found');
	auth_controller.auth_google(req.body, res);
});

module.exports = router;
