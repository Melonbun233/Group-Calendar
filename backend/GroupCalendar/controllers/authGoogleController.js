// var mysql = require('mysql');

// var con_userDB = mysql.createConnection({
//   host: "localhost",
//   user: "yourusername",
//   password: "yourpassword",
//   database: "UserDB"
// });

// the req is the idToken of user
var express = require('Express');
var auth = express();

var CLIENT_ID = ???;
exports.auth_google = function(req, res){
	const {OAuth2Client} = require('google-auth-library');
	const client = new OAuth2Client(CLIENT_ID);
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: req,
			audience: CLIENT_ID, 
		});
		const payload = ticket.getPayload();
		const userid = payload['sub'];
  	// If request specified a G Suite domain:
  	//const domain = payload['hd'];
  }
  verify().catch(console.error);

  var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + idToken;
  auth.get(url, function(google_err, google_res){
  	if(google_err) throw google_err;
  	con_userDB.query("SELECT * FROM Users WHERE user_email = google_req.email", 
  		function(user_err, user_result){
  		// if user could not be found in the DB, we should create a new account for the user
  		if(user_err){
  			con_userDB.query("INSERT INTO Users (user_email) VALUES (google_res.email)"
  				function(user_err2, user_new){
  					if(user_err2) throw user_err2;
  				// user_new contains the user_id and we need to give new user a calendar id 
  				con_calenDB.query("INSERT INTO Calendars (user_id) VALUES (user_new.user_id)", 
  					function(calen_err, calen_result){
  						if(calen_err) throw calen_err;
  					});
  				// set user id in new calendar entry
  				con_calenDB.query("SELECT calendar_id From Calendars WHERE user_id = user_new.user_id", 
  					function(calen_err, calen_id){
  						if(calen_err) throw calen_err;
  						// set calendar id in new user entry
  						con_userDB.query("UPDATE Users SET calendar_id = calen_id WHERE user_id = user_new.user_id",
  							function(user_err3, user_result3){
  								if(user_err3) throw user_err3;
  							});
  					});
  			});
  			// new user entry should be here
  			con_userDB.query("SELECT * FROM Users WHERE user_email = google_req.email", 
  				function(user_err4, user_result4){
  					if(user_err4) {
  						res.status(404);
  						res.json(null);
  						throw user_err4;
  					}

  					res.json(user_result4);
  				});

  		} else {
  			// the user has an account before
  			res.json(user_result);
  		}
  	});
  });
};