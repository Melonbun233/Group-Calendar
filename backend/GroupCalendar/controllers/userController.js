var User = require('../models/user.js');
const {validationResult} = require('express-validator/check');


async function userInfoGet (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user email."});
	}

	var info;

	try{ 
		let info = await User.get_info(req.param('userEmail'));
	} catch (error) {
		res.status(404).json({error});
	}

	res.status(200).json(info);
};

async function userInfoPut (req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user info."});
	}

	try {
		await User.updateInfo(req.body);
	} catch (error) {
		res.status(400).json({error});
	}
	
	res.status(200).json();
};

async function userCreate (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()){ 
		return res.status(400).json({"error": "Invalid user info."});
	}

	try{
		await User.createProfile(req.body.profile);
		await User.createUser(req.body.user);
	} catch (error) {
		return res.status(400).json({ error });
	}

	return res.status(200).json();
};

exports.userIdPost = function(req, res){
	res.send('NOT IMPLEMENTED: user id post');
};

exports.userDelete = function(req, res){
	res.send('NOT IMPLEMENTED: user delete');
};

module.exports = {
	userInfoPut,
	userCreate,
	userInfoGet
}


