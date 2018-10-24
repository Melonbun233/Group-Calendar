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
    .catch((error) => {
      console.log(error);
    });

  // var passport = require('passport');
  // var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  // var User = require('../models/User');

  // passport.use(new GoogleStrategy({
  //   clientID: "591307876438-4nmmm817vks785u467lo22kss40kqno2.apps.googleusercontent.com",
  //   clientSecret: "BagENe4LxG_PZ_qz2oFX7Aok",
  //   callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  // },
  // function(accessToken, refreshToken, profile, done) {
  //  User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id }, function (err, user) {
  //    return done(err, user);
  //  });
  // }
  // ));

  // module.exports = passport;

  // const {OAuth2Client} = require('google-auth-library');
  // const http = require('http');
  // const url = require('url');
  // const querystring = require('querystring');
  // const opn = require('opn');

  // // Download your OAuth2 configuration from the Google
  // const keys = require('./keys.json');

  // /**
  //  * Start by acquiring a pre-authenticated oAuth2 client.
  //  */
  //  async function main() {
  //   try {
  //     const oAuth2Client = await getAuthenticatedClient();
  //     // Make a simple request to the Google Plus API using our pre-authenticated client. The `request()` method
  //     // takes an AxiosRequestConfig object.  Visit https://github.com/axios/axios#request-config.
  //     const url = 'https://www.googleapis.com/plus/v1/people?query=pizza';
  //     const res = await oAuth2Client.request({url})
  //     console.log(res.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   process.exit();
  // }

  // /**
  //  * Create a new OAuth2Client, and go through the OAuth2 content
  //  * workflow.  Return the full client to the callback.
  //  */
  //  function getAuthenticatedClient() {
  //   return new Promise((resolve, reject) => {
  //     // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
  //     // which should be downloaded from the Google Developers Console.
  //     const oAuth2Client = new OAuth2Client(
  //       keys.web.client_id,
  //       keys.web.client_secret,
  //       keys.web.redirect_uris[0]
  //       );

  //     // Generate the url that will be used for the consent dialog.
  //     const authorizeUrl = oAuth2Client.generateAuthUrl({
  //       access_type: 'offline',
  //       scope: 'https://www.googleapis.com/auth/plus.me'
  //     });

  //     // Open an http server to accept the oauth callback. In this simple example, the
  //     // only request to our webserver is to /oauth2callback?code=<code>
  //     const server = http.createServer(async (req, res) => {
  //       if (req.url.indexOf('/oauth2callback') > -1) {
  //       // acquire the code from the querystring, and close the web server.
  //       const qs = querystring.parse(url.parse(req.url).query);
  //       console.log(`Code is ${qs.code}`);
  //       res.end('Authentication successful! Please return to the console.');
  //       server.close();

  //       // Now that we have the code, use that to acquire tokens.
  //       const r = await oAuth2Client.getToken(qs.code)
  //       // Make sure to set the credentials on the OAuth2 client.
  //       oAuth2Client.setCredentials(r.tokens);
  //       console.info('Tokens acquired.');
  //       resolve(oAuth2Client);
  //     }
  //   }).listen(3000, () => {
  //     // open the browser to the authorize url to start the workflow
  //     opn(authorizeUrl);
  //   });
  // });
  // }

  // main();


  var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.id_token;
  auth.get(url, function(google_req, google_res){
   // if(google_err) 
   //  auth_res.status(400).send('Can\'t connect to Google auth center.');

    User.get_info(google_res.email, function(user_res){
      // if(db_err) 
      //   auth_res.status(400).send('Server fails to deal with your Google account.');
      var user_id;
      if(user_res.user_id === null){
        User.create_user(google_res.email, function(res){
          // if(err) 
          //   auth_res.status(400).send('Server fails to create a new account.');
          user_id = res;
        });
        User.get_info_byId(user_id, function(res){
          // if(err)
          //   auth_res.status(400).send('Server fails to find the new user.');
          // successfully create a new user and return the user info
          auth_res.status(200).json(res);
        });
      } else {
        // found the exisiting record
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