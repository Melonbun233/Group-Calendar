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
var CLIENT_ID = "948599028756-qju3o61c2ob60um012tvol60u6p7q6gf.apps.googleusercontent.com";
// var is_varified = 0;

async function verify(_idToken) {
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: _idToken,
    audience: CLIENT_ID, 
  });
  //const payload = ticket.getPayload();
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

exports.auth_google = async function(req, res){

  let id_token = req.id_token;
  let email = req.user_email;
  let user_lastname = req.user_lastname;
  let user_firstname = req.user_firstname;

  if(id_token === 'undefined' || email === 'undefined'  || 
    user_firstname === 'undefined'){
    console.log('Err: empty post body');
    res.status(400).send('Can\'t find your google id token or profile information');

}

await verify(id_token)
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


  User.get_info(email, function(get_err, user_res){
    if(get_err) 
      throw get_err;
    console.log('Finding user google email from our Database...');
    //   auth_res.status(400).send('Server fails to deal with your Google account.');
    var user_id;
    if(user_res === null){
      User.create_user(email, function(create_err, db_res){
        if(create_err) 
          throw create_err;
        console.log('creating new user...');
        //   auth_res.status(400).send('Server fails to create a new account.');
        user_id = db_res.user_id;
      });

      var setcmd = "user_firstname='" + user_firstname + "'";
      User.update_profile(setcmd, user_id, function(update_err, db_res){
        if(update_err)
          throw update_err;
      });

      if(user_lastname !== null && user_lastname !== 'undefined'){
        var setcmd = "user_lastname='" + user_lastname + "'";
        User.update_profile(setcmd, user_id, function(update_err, db_res){
          if(update_err)
            throw update_err;
        });
      }

    } else {
      // found the exisiting record
      console.log('Found user from DB');
      var setcmd = "user_firstname='" + user_firstname + "'";
      User.update_profile(setcmd, user_res.user_id, function(update_err, db_res){
        if(update_err)
          throw update_err;
      });

      if(user_lastname !== null && user_lastname !== 'undefined'){
        var setcmd = "user_lastname='" + user_lastname + "'";
        User.update_profile(setcmd, user_res.user_id, function(update_err, db_res){
          if(update_err)
            throw update_err;
        });
      }
    }

  });

  User.get_profile_byId(user_id, function(get_new_err, db_res){
      if(get_new_err)
        throw get_new_err;
      console.log('New account has been setup');

      var profile = db_res;
    });

    var uuid = UidG.uuid_create(email);
    res.status(200).json({uuid, profile});


};
  	
