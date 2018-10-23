var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'mysql'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})