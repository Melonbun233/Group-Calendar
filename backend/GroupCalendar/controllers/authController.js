// var mysql = require('mysql');

// var con_userDB = mysql.createConnection({
//   host: "localhost",
//   user: "yourusername",
//   password: "yourpassword",
//   database: "UserDB"
// });

// the req is the idToken of user
var User = require('../models/user.js');
var UidG = require('./uuidGenerator.js');

// var url = require('url');
const {OAuth2Client} = require('google-auth-library');
var CLIENTID = '948599028756-qju3o61c2ob60um012tvol60u6p7q6gf.apps.googleusercontent.com';
// var is_varified = 0;

async function verify(_idToken) {
  const client = new OAuth2Client(CLIENTID);
  const ticket = await client.verifyIdToken({
    idToken: _idToken,
    audience: CLIENTID, 
  });
  //const payload = ticket.getPayload();
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

async function authGoogle (req, res){

  let idToken = req.body.idToken;
  let email = req.body.user.userEmail;
  let userLastname = req.body.user.familyName;
  let userFirstname = req.body.user.givenName;
  let userId;
  let err = false;

  // console.log(userLastname);
  // console.log(userFirstname);

  if(idToken === 'undefined' || email === 'undefined' || 
    userFirstname === 'undefined'){
    console.log('empty post body');
  res.status(400).send('Can\'t find your google id token or profile information');

}

  //verify google idToken

  await verify(idToken)
  .catch((error) => {
    // is_varified = 0;
    console.log('Verification Failure');
    err = true;
  });
  
  if (err){
    return res.status(400).send('Can\'t verify your google id token');
  }

  console.log('Successful Verification');

  // successfully in server

  var userInfo = await User.getInfo(email)
  .catch((error) => {
    console.log('Err: getInfo');
    err = true;
  });
  if (err){
    return res.status(500).end();
  }

  console.log('Finding user google email from our Database...');

  if(userInfo === null || userInfo === 'undefined'){
    var user = {
      userEmail: email
    }
    var profile = {
      userEmail: email,
      userLastname: userLastname,
      userFirstname: userFirstname
    }

    await User.createUser(user, profile)
    .catch((error) => {
      console.log('Err: createUser');
      err = true;
    });

    if (err){
      return res.status(500).end();
    }

    var newUser = await User.getInfo(email)
    .catch((error) => {
      console.log('Err: getInfo');
      err = true;
    });

    if (err){
      return res.status(500).end();
    }

    if(newUser === null || userInfo === 'undefined'){
      console.log('Err: getInfo');
      return res.status(500).end();
    }

    console.log('created new user');
    userId = newUser.userId;


  } else {
    // found the exisiting record
    console.log('Found user from DB');
    userId = userInfo.userId;

    console.log(userId = userInfo.userId);
    var setcmd = "userFirstname='" + userFirstname + "'";

    await User.updateProfile(setcmd, userId)
    .catch ((error) => {
      console.log('Err: updateProfile');
      err = true;
    });

    if(err){
      return res.status(500).end();
    }


    if(userLastname !== null || userLastname !== 'undefined'){
      setcmd = "userLastname='" + userLastname + "'";
      await User.updateProfile(setcmd, userId)
      .catch ((error) => {
        console.log('Err: updateProfile');
        err = true;
      });

      if(err){
        return res.status(500).end();
      }
    }
  }


  var profile = await User.getProfileById(userId)
  .catch ((error) => {
    console.log('Err: getProfileById');
    err = true;
  });

  if(err){
    return res.status(500).end();
  }

  var uuid = UidG.uuidCreate(email);
  req.session.uuid = uuid;
  res.status(200).json(profile);

}

async function authApp (req, res){

  let email = req.body.userEmail;
  let pwd = req.body.userPwd;
  let err = false;
  
  if(email === 'undefined' || pwd === 'undefined'){
    console.log('empty post body');
    return res.status(400).send('Empty email or password');
  }

  // await User.login(email, pwd)
  // .catch(error =>{
  //   throw error;
  //   res.status(400).send('Invalid email');
  // })
  // .then(result =>{
  //   console.log(result);

  //   if(result == null || undefined){
  //     res.status(400).send('Err: login');
  //   }
  //   if(result == 0 || result == -1){
  //     res.status(400).send('Incorrect emial or password');
  //   }
  //   var userId = result;
  // })
  var userId = await User.login(email, pwd)
  .catch(error => {
    console.log('Err: login');
    err = true;
  });

  if(err){
    res.status(500).end();
  }
  
  console.log(userId);

  if(userId == 0 || userId == -1){
    return res.status(400).send('Incorrect emial or password');
  }
  
  var profile = await User.getProfileById(userId)
  .catch ((error) => {
    console.log('Err: getProfileById');
    err = true;
  });

  if(err){
    return res.status(500).end();
  }

  console.log(profile);

  var uuid = UidG.uuidCreate(email);
  req.session.uuid = uuid;

  console.log(req.session.uuid);

  res.status(200).json(profile);

}

module.exports = {
  authGoogle,
  authApp
}


