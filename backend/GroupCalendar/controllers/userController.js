var User = require('../models/user.js');
const {validationResult} = require('express-validator/check');

/* /users */
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

async function userUpdate (req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({"error": "Invalid user info."});
	}

	try {
		await User.updateUser(req.body);
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
		await User.createUser(req.body.user, req.body.profile);
	} catch (error) {
		return res.status(400).json({ error });
	}

	res.status(200).json();
};

async function userDelete (req, res) {
	try {
		await User.deleteUser(req.body.userId);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).end();
}

/*----------------------*/
/*----/users/profiles---*/
async function profileGet (req, res) {
	var profile;

	try {
		profile = await User.getProfile(req.param('userId'));
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).json({profile});
}

async function profileUpdate (req, res) {
	try {
		await User.updateProfile(req.body);
	} catch (error) {
		return res.status(400).json({error});
	}

	return res.status(200).end();
}

module.exports = {
	userInfoGet,
	userUpdate,
	userCreate,
	userDelete,
	profileGet,
	profileUpdate
}