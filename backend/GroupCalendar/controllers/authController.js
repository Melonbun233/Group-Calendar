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

  let idToken = req.idToken;
  let email = req.userEmail;
  let userLastname = req.userLastname;
  let userFirstname = req.userFirstname;

  if(idToken === 'undefined' || email === 'undefined'  || 
    userFirstname === 'undefined'){
    console.log('Err: empty post body');
  res.status(400).send('Can\'t find your google id token or profile information');

}

await verify(idToken)
.catch((error) => {
  throw error;
    // is_varified = 0;
    res.status(400).send('Can\'t verify your google id token');
    return console.log(error);
  })
.then(async(result) => {
  console.log('Successful Verification');

  // successfully in server

  var userInfo = await User.getInfo(email)
  .catch((error) => {
    throw error;
    res.status(400).send('Err: getInfo');
  });
  
  console.log('Finding user google email from our Database...');
  //   auth_res.status(400).send('Server fails to deal with your Google account.');
  var userId;
  if(userInfo === null){
    var user = {
      userEmail: email
    }
    var profile = {
      userEmail: email,
      userLastname: userLastname,
      userFirstname: userFirstname
    }

    var newUser = await User.createUser(user, profile)
    .catch((error) => {
      throw error;
      res.status(400).send('Err: createUser');
    })

    console.log('created new user');
    userId = newUser.userId;


  } else {
    // found the exisiting record
    console.log('Found user from DB');
    userId = userInfo.userId;
    var setcmd = "userFirstname='" + userFirstname + "'";

    await User.updateProfile(setcmd, userId)
    .catch ((error) => {
      throw error;
      res.status(400).send('Err: updateProfile');
    })


    if(userLastname !== null && userLastname !== 'undefined'){
      var setcmd = "userLastname='" + userLastname + "'";
      await User.updateProfile(setcmd, userId)
      .catch ((error) => {
        throw error;
        res.status(400).send('Err: updateProfile');
      })
    }
  }

})

var profile = await User.getProfileById(userId)
.catch ((error) => {
  throw error;
  res.status(400).send('Err: getProfileById');
})

var uuid = UidG.uuidCreate(email);
req.session.uuid = uuid;
res.status(200).json(profile);

}

async function authApp (req, res){

  let email = req.userEmail;
  let pwd = req.userPwd
  
  if(email === 'undefined' || pwd === 'undefined'){
    console.log('Err: empty post body');
    res.status(400).send('Empty email or password');

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
  try{
    var userId = await User.login(email, pwd);
  } catch(error) {
    res.status(400).send('Invalid email');
  }
  
  console.log(userId);

  if(userId == null || undefined){
    res.status(400).send('Err: login');
  }
  if(userId == 0 || userId == -1){
    res.status(400).send('Incorrect emial or password');
  }
  


  var profile = await User.getProfileById(userId)
  .catch ((error) => {
    throw error;
    res.status(400).send('Err: getProfileById');
  })

  var uuid = UidG.uuidCreate(email);
  req.session.uuid = uuid;
  res.status(200).json(profile);

}

module.exports = {
  authGoogle,
  authApp
}


