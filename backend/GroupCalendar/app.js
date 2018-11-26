var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var UserDB = require('./databases/UserDB');
var ProjectDB = require('./databases/ProjectDB');
var CalendarDB = require('./databases/CalendarDB');
var bodyParser = require('body-parser');
//var sqlinjection = require('sql-injection');
var session = require('client-sessions');
var Promise = require('promise'); // npm install promise...

/*----require routers-----------*/
var projectRouter = require('./routes/project');
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
/*------------------------------*/
var app = express();

/*
 * defined functions
 */

/**
 * exclude path listed here
 */
function checkPath(path){
  if(path === '/auth/google' || path === '/auth/app' || path === '/users/signup'){
    return false;
  } else {
    return true;
  }
}
/**
 * uuid check would be more safer if server stores one copy in database
 * it will be added in the future
 */
function uuidCheck(req){
  if(req.headers.session == 'undefined'){
    return false;
  }
  if(req.session.uuid == null || req.session.uuid == 'undefined'){
    return false;
  }
  return true;

}


app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(sqlinjection);

app.use(session({
	cookieName: 'session',
	secret: 'secret key',
	//duration: how long the session will live in milliseconds
	// duration: 2 * 7 * 24 * 60 * 60 * 1000,
  duration: 30 * 1000,
	//activeDuration: allows users to lengthen their session by interacting with server
	// activeDuration: 1 * 7 * 24 * 60 * 60 * 1000,
  activeDuration: 30 * 1000,
  // cookie: {
  //   maxAge: 10 * 1000,
  // }
}));

app.use(function(req, res, next){
  console.log(`path: ${req.path}`);
  
  if(checkPath(req.path)){
    
    if (uuidCheck(req)){
      next();
    }else{
      res.status(401).send("expired session");
    } 
  }else{
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(8080, '0.0.0.0');




//app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/auth',authRouter);
app.use('/project', projectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
