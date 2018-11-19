var express = require("express");
var bodyParser = require("body-parser");
var session = require('client-sessions');

// var uuidCheck = require('./uuidCheck');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(session({
	cookieName: 'session',
	secret: 'secret key',
	//duration: how long the session will live in milliseconds
	duration: 20 * 1000,
	//activeDuration: allows users to lengthen their session by interacting with server
	activeDuration: 10 * 1000,
}));

app.use(function(req, res, next){
  console.log('middleware');
  if(req.path != '/auth'){
    if (req.session.uuid == 'undefined'){
      console.log(req.session.uuid);
      res.status(401).send("expired session");
    } else {
      next();
    }
  }
});

console.log('Entering Test Server...')

app.post('/auth', function(req, res){
  console.log('test auth');
  // console.log(req);
  req.session.uuid = req.body.uuid;
  console.log(req.body);
  console.log(req.session)
  res.status(200).send(req.session.uuid);
});

app.post('/', function(req, res){
 console.log('test post');
  // console.log(req);
  console.log(req.body);
  console.log(req.session)
  res.status(200).send(req.session.uuid);
});

app.get('/', function(req, res){
  console.log('test get');
  console.log(req.session);
  res.status(200).send(req.session.uuid);
});

app.listen(3000,'0.0.0.0');

