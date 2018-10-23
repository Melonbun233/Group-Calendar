var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'UserDB'
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to UserDB...');
});

exports.query = function(query, result){ 
	db.query(query, function(err, res){
		if (err) throw err;
		//console.log(res);
		result(null, res);
	});
};