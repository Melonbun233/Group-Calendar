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

exports.query = function(query, res){ 
	request.query(query, function(err, res){
		if (err){
			console.log("error while query");
			res.send(err);
		} else {
			console.log("query successful");
			res.send(res);
		}
	});
};