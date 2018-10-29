var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'profiledb',
  //multipleStatements: true,
  port: 3306
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to ProfileDB...');
});

exports.query = function(query){ 
	db.query(query, function(err, res){
		if (err) 
      console.log(err);
		else 
      return res; 
	});
};