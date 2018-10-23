var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321'
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to mysql...');
});

var request = mysql.Request();

exports.query(query, function(err, res){
	if (err){
		console.log("ERROR while query");
		res.send(err);
	} else {
		console.log("Query successful");
		res.send(res);
	}
});