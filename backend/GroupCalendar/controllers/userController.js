var User = require('../models/user.js');

exports.user_info_get = function(req, res){
	User.info_get(req, function(err, info){
		if (err) 
			throw err;
		else if (info.length == 0)
			res.status(404).json({error: "User name does not refer to any entry."});
		else
			res.status(200).json(info);
	});
};

exports.user_info_put = function(req, res){
	res.send('NOT IMPLEMENTED: user info put');
};

exports.user_id_post = function(req, res){
	res.send('NOT IMPLEMENTED: user id post');
};

exports.user_delete = function(req, res){
	res.send('NOT IMPLEMENTED: user delete');
};

