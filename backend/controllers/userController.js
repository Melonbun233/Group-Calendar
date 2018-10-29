var User = require('../models/user.js');
const {validationResult} = require('express-validator/check');
var jwt = require('../middlewares/jwt');

exports.user_info_get = function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user name."});
	}

	User.get_info(req.param('user_email'), function(err, info){
		if (err)
			console.log(err);
		else if (info === null)
			res.status(404).json({error: "User name does not refer to any entry."});
		else
			res.status(200).json(info);
	});
};

exports.user_info_put = function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user info."});
	}

	User.update_info(req.body, (updated_info) => res.status(200).json());
};

exports.user_create = function(req, res){
	const errors = validationResult(req.body);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user info."});
	}

	res.status(200).json({
		"user": User.create_user(req.body.user),
		"profile": User.create_profile(req.body.profile),
		"uuid": jwt.newToken(req.body)
	});
};