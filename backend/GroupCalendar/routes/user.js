var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var userController = require('../controllers/userController');
const url = require('url');  
var validator = require('../middlewares/validation');

router.put('/', 
	userController.userUpdate);

router.post('/signup',
	// (req, res, next) => { 
	// 	Object.assign(req.params, req.body.profile, req.body.user);
	// 	next();
	// }, 
	// validator.checkParams,
	userController.userCreate);

router.delete('/', 
	userController.userDelete);

router.get('/profile',
	userController.profileGet);

router.put('/profile',
	userController.profileUpdate);


module.exports = router;
