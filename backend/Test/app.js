var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var Mail = require('./mailController.js');

// var uuidCheck = require('./uuidCheck');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function checkPath(path){
  if(path === '/auth'){
    return false;
  } else {
    return true;
  }
}

function uuidCheck(req){

  if(req.session.uuid == null || req.session.uuid == 'undefined'){
    return false;
  }
  return true;

}

app.use(session({
 name: 'session',
 secret: 'secret key',
	//duration: how long the session will live in milliseconds
	// duration: 40 * 1000,
	//activeDuration: allows users to lengthen their session by interacting with server
	// activeDuration: 10 * 1000,
  resave: true,
  saveUninitialized: false,
  cookie:{
    httpOnly: false,
    maxAge: 10 * 60 * 60 * 1000,
  }
}));

app.use(function(req, res, next){
  console.log(`path: ${req.path}`);
  // console.log(`uuid: ${req.session.uuid}`);
  // console.log(req.session);
  // console.log(req.session.cookie.maxAge);
  // console.log(req.session.cookie.maxAge);
  
  if(checkPath(req.path)){

    if (uuidCheck(req)){
      req.session._garbage = Date();
      req.session.touch();
      // console.log(req.session.cookie.maxAge);
      // req.session.cookie.originalMaxAge += 5 * 1000;
      next();
    }else{
      // res.status(401).send("expired session");
      next();
    } 
  }else{
    next();
  }
});

console.log('Entering Test Server...')

app.post('/auth', function(req, res){
  console.log('test auth');
  // console.log(req);
  req.session.uuid = req.body.uuid;
  
  res.status(200).send(req.session.uuid);
});

app.post('/', function(req, res){
 console.log('test post');
  // console.log(req);
  // console.log(req.body);
  // console.log(req.session)
  res.status(200).send(req.session.uuid);
});

app.get('/', function(req, res){
  console.log('test get');
  // let receiver = 'kylejoeca@gmail.com';
  // let subject = 'welcome to new project';
  // let text = 'project 1 is inviting invite you';
  // Mailsys.sendEmail(receiver, subject, text);
  var invitedProject = {projectName : "test project"};
  var invitor = {
    userFirstName : "Kyle",
    userLastName: "Jiang",
  };
  var invitedEmail = "kylejoeca@gmail.com";

  var projectName = `${invitedProject.projectName}`;
  var userName = `${invitor.userFirstName} ${invitor.userLastName}`;


  var receiver = invitedEmail;
  var subject = '[Group Calendar]: New Project Invitation';
  var text = `${userName} is inviting you to the Project: "${projectName}".`;
  Mail.sendEmail(receiver, subject, text, text);

  res.status(200).send(req.session.uuid);
});



app.listen(3000,'0.0.0.0');

