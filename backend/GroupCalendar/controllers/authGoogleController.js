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

exports.authGoogle = async function(req, res){

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
    // is_varified = 0;
    res.status(400).send('Can\'t verify your google id token');
    return console.log(error);
  });
console.log('Successful Verification');
  // auth_res.send('post test');
  
  // const endpoint_url = new URL('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + auth_req.id_token);
  
  // var endpoint_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token;
  // //console.log(endpoint_url);

  // auth.get(endpoint_url, function(google_req, google_res){
  //   if(google_res === null){
  //     return res.status(400).send('Can\'t connect to Google auth center.\n');
  //   }
  //   email = google_res.email;
  // });


  User.getInfo(email, function(getErr, userRes){
    if(getErr){ 
      throw getErr;
    }
    console.log('Finding user google email from our Database...');
    //   auth_res.status(400).send('Server fails to deal with your Google account.');
    var userId;
    if(userRes === null){
      User.createUser(email, function(createErr, dbRes){
        if(createErr){ 
          throw createErr;
        }
        console.log('creating new user...');
        //   auth_res.status(400).send('Server fails to create a new account.');
        userId = dbRes.userId;
      });

      var setcmd = "userFirstname='" + userFirstname + "'";
      User.updateProfile(setcmd, userId, function(updateErr, dbRes){
        if(updateErr){
          throw updateErr;
        }
      });

      if(userLastname !== null && userLastname !== 'undefined'){
        var setcmd = "userLastname='" + userLastname + "'";
        User.updateProfile(setcmd, userId, function(updateErr, dbRes){
          if(updateErr){
            throw updateErr;
          }
        });
      }

    } else {
      // found the exisiting record
      console.log('Found user from DB');
      var setcmd = "userFirstname='" + userFirstname + "'";
      User.updateProfile(setcmd, userRes.userId, function(updateErr, dbRes){
        if(updateErr){
          throw updateErr;
        }
      });

      if(userLastname !== null && userLastname !== 'undefined'){
        var setcmd = "userLastname='" + userLastname + "'";
        User.updateProfile(setcmd, userRes.userId, function(updateErr, dbRes){
          if(updateErr){
            throw updateErr;
          }
        });
      }
    }

  });

  User.getProfileById(userId, function(getNewErr, dbRes){
      if(getNewErr){
        throw getNewErr;
      }
      console.log('New account has been setup');

      var profile = dbRes;
    });

    var uuid = UidG.uuidCreate(email);
    res.status(200).json({uuid, profile});


};
  	
