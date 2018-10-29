var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'userdb',
  //multipleStatements: true,
  port: 3306
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to UserDB...');
});

exports.query = function(query, result){ 
	db.query(query, function(err, res){
		if (err) 
      result(err, null);
		else 
      result(null, res);
	});
};