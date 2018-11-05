var User = require('../models/user.js');

exports.userInfoGet = function(email, res){
	//console.log("getting user info");
	User.getInfo(email, function(err, info){
		if (err){
			console.log(err);
		}
		else if (info === null){
			res.status(404).json({error: 'User name does not refer to any entry.'});
		}
		else{
			res.status(200).json(info);
		}
	});
};

exports.userInfoPut = function(infoJson, res){
	User.updateInfo(infoJson, function(err, updatedInfo){
		if (err){
			console.log(err);
		}
		else if (updatedInfo === null){
			res.status(404).json({error: 'User id does not refer to any entry.'});
		}
		else{
			res.status(200).json(updatedInfo);
		}
	});
};

exports.userIdPost = function(req, res){
	res.send('NOT IMPLEMENTED: user id post');
};

exports.userDelete = function(req, res){
	res.send('NOT IMPLEMENTED: user delete');
};

