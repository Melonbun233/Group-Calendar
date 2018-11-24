var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var userController = require('../controllers/userController');
const url = require('url');  
var validator = require('../middlewares/validation');

router.put('/', 
	userController.userUpdate);

router.post('/signup',
	userController.userCreate);

router.delete('/', 
	userController.userDelete);

router.get('/profile',
	userController.profileGet);

router.put('/profile',
	userController.profileUpdate);

router.get('/projects',
	userController.getProjectId);


module.exports = router;
