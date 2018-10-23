var db = require('../db.js');


exports.info_get = function(email, res){
	db.query("SELECT * FROM Users WHERE user_email = '123@gmail.com'",
		function (err, res){
			console.log('\ndb query working\n');
			if (err) throw err;
			res.send(res);
		});
};