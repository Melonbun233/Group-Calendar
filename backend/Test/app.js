var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
console.log('Entering Test Server...')

app.post('/', function(req, res){
  console.log('test post');
  console.log(req.headers);
  console.log(req.body);
  // console.log(req);
  res.send(req.body.user_id);
});

app.get('/', function(req, res){
  console.log('test get');
  res.send('success');
});

app.listen(8080,'0.0.0.0');