var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

app.post('/', function(req, res){
  console.log('test post');
  console.log(req.body.user_id);
  console.log(req.body);
  res.send(req.body.user_id);
});

app.get('/', function(req, res){
  console.log('test get');
  res.send('success');
});

app.listen(3000,'0.0.0.0');