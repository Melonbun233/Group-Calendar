var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'CalendarDB'
});

db.connect(function(err) {
  if (err) {throw err};
  console.log('You are now connected to Calendar...');
});

function query(req){
  return new Promise ( (resolve, reject) => {
    db.query(req, (err, result) => {
      if (err){
        reject(err);
      }
      resolve(result);
    })
  });
}

module.exports = {
  query
}