var User = require('../models/user.js');

exports.user_info_get = function(req, res){
	User.get_info(req, function(err, info){
		if (info==null) 
			res.status(400).send('Invalid id_token');
		else 
			res.status(400).json(info);
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

