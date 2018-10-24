var User = require('../models/user.js');

exports.user_info_get = function(email, res){
	//console.log("getting user info");
	User.get_info(email, function(err, info){
		if (err)
			console.log(err);
		else if (info === null)
			res.status(404).json({error: "User name does not refer to any entry."});
		else
			res.status(200).json(info);
	});
};

exports.user_info_put = function(info_json, res){
	User.update_info(info_json, function(err, updated_info){
		if (err)
			console.log(err);
		else if (updated_info === null)
			res.status(400).json({"error": "User id does not refer to any entry."});
		else
			res.status(200).json(updated_info);
	});
};

exports.user_id_post = function(req, res){
	res.send('NOT IMPLEMENTED: user id post');
};

exports.user_delete = function(req, res){
	res.send('NOT IMPLEMENTED: user delete');
};

