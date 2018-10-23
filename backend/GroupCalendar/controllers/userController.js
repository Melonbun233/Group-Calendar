var User = require('../models/user.js');

exports.user_info_get = function(req, res){
	console.log('\nIn userController user_info_get\n');
	User.info_get(req, function(err, info){
		if (err){
			console.log('\nInvalid id_token\n');
			res.status(400).send('Invalid id_token');
		}
		else {
			res.json(info);
		}
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

