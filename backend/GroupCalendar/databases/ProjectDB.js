var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'ProjectDB'
});

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('You are now connected to ProjectDB...');
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
  query,
}