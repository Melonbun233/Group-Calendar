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