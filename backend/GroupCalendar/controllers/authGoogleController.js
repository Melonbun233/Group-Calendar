// var mysql = require('mysql');

// var con_userDB = mysql.createConnection({
//   host: "localhost",
//   user: "yourusername",
//   password: "yourpassword",
//   database: "UserDB"
// });

// the req is the idToken of user
var express = require('express');
var auth = express();
var User = require('../models/user.js');
const url = require('url');
const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = "948599028756-qju3o61c2ob60um012tvol60u6p7q6gf.apps.googleusercontent.com";

async function verify(_idToken) {
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: _idToken,
    audience: CLIENT_ID, 
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
exports.auth_google = (req, auth_res) => {
   verify(req.id_token)

// exports.auth_google = function(auth_req, auth_res){
  // console.log(req.id_token);

  verify(req.id_token)
    .catch((error) => {
      console.log(error);
    });
    console.log('Successful Verification...');

  
  // const endpoint_url = new URL('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + auth_req.id_token);
  var endpoint_url = "'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + id_token+ "'";
  console.log(endpoint_url);

  auth.get(endpoint_url, function(google_req, google_res){
   // if(google_err) 
   //  auth_res.status(400).send('Can\'t connect to Google auth center.');

    User.get_info(google_res.email, function(get_err, user_res){
      if(get_err) 
        throw get_err;
      console.log('Finding your google email from our Database...');
      //   auth_res.status(400).send('Server fails to deal with your Google account.');
      var user_id;
      if(user_res.user_id === null){
        User.create_user(google_res.email, function(create_err, res){
          if(create_err) 
            throw create_err;
          console.log('Welcome new user');
          //   auth_res.status(400).send('Server fails to create a new account.');
          user_id = res;
        });
        User.get_info_byId(user_id, function(get_new_err, res){
          if(get_new_err)
            throw get_new_err;
          console.log('New account has been setup');
          //   auth_res.status(400).send('Server fails to find the new user.');
          // successfully create a new user and return the user info
          auth_res.status(200).json(res);
        });
      } else {
        // found the exisiting record
        console.log('Welcome Back');
        auth_res.status(200).json(user_res);
      }

    });
  	// con_userDB.query("SELECT * FROM Users WHERE user_email = google_res.email", 
  	// 	function(user_err, user_result){
  	// 	// if user could not be found in the DB, we should create a new account for the user
  	// 	if(user_err){
  	// 		con_userDB.query("INSERT INTO Users (user_email) VALUES (google_res.email)",
  	// 			function(user_err2, user_new){
  	// 				if(user_err2) throw user_err2;
  	// 			// user_new contains the user_id and we need to give new user a calendar id 
  	// 			con_calenDB.query("INSERT INTO Calendars (user_id) VALUES (user_new.user_id)", 
  	// 				function(calen_err, calen_result){
  	// 					if(calen_err) throw calen_err;
  	// 				});
  	// 			// set user id in new calendar entry
  	// 			con_calenDB.query("SELECT calendar_id From Calendars WHERE user_id = user_new.user_id", 
  	// 				function(calen_err, calen_id){
  	// 					if(calen_err) throw calen_err;
  	// 					// set calendar id in new user entry
  	// 					con_userDB.query("UPDATE Users SET calendar_id = calen_id WHERE user_id = user_new.user_id",
  	// 						function(user_err3, user_result3){
  	// 							if(user_err3) throw user_err3;
  	// 						});
  	// 				});
  	// 		});
  	// 		// new user entry should be here
  	// 		con_userDB.query("SELECT * FROM Users WHERE user_email = google_req.email", 
  	// 			function(user_err4, user_result4){
  	// 				if(user_err4) {
  	// 					res.status(404);
  	// 					res.json(null);
  	// 					throw user_err4;
  	// 				}

  	// 				res.json(user_result4);
  	// 			});

  	// 	} else {
  	// 		// the user has an account before
  	// 		res.json(user_result);
  	// 	}
  });

};