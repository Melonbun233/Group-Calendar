var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected...');
});