var express = require("express");
var bodyParser = require("body-parser");
var session = require('client-sessions');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
	cookieName: 'session',
	secret: 'secret key',
	//duration: how long the session will live in milliseconds
	duration: 200 * 1000,
	//activeDuration: allows users to lengthen their session by interacting with server
	activeDuration: 100 * 1000,
}));

console.log('Entering Test Server...')

app.post('/', function(req, res){
	console.log('test post');
  // console.log(req);
  req.session.id = req.body.id;
  console.log(req.body);
  console.log(req.session)
  res.status(200).send(req.session.id);
});

app.get('/', function(req, res){
  console.log('test get');
  console.log(req.session);
  res.status(200).send(req.session.id);
});

app.listen(3000,'0.0.0.0');

