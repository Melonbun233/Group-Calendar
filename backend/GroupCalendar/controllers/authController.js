var User = require('../models/user.js');
var UidG = require('./uuidGenerator.js');
var Gverify = require('./googleVerification.js')

async function authGoogle (req, res){
  let idToken = req.body.idToken;
  let email = req.body.user.email;
  // let pwd = req.body.user.pwd;
  let userLastname = req.body.user.familyName;
  let userFirstname = req.body.user.givenName;
  let userId;
  let err = false;
  let pwdSet = true;

  // console.log(userLastname);
  // console.log(userFirstname);

  if(idToken == 'undefined' || email == 'undefined' || 
    userFirstname == 'undefined'){
    console.log('req is not valid');
   return res.status(400).send('Can\'t find your google id token or profile information');

}

  //verify google idToken

  await Gverify.verify(idToken)
  .then(result => {
    console.log('Successful Verification')
  })
  .catch((error) => {
    // is_varified = 0;
    console.log('Verification Failure');
    err = true;
  })

  if (err){
    return res.status(400).send('Can\'t verify your google id token');
  }

  // successfully in server

  var userInfo = await User.getInfo(email)
  .catch((error) => {
    console.log('Err: getInfo');
    err = true;
  });
  if (err){
    return res.status(500).end();
  }

  // console.log(userInfo);

  if(userInfo == null || userInfo == 'undefined'){

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

    if(newUser == null || userInfo == 'undefined'){
      console.log('Err: getInfo');
      return res.status(500).end();
    }

    // console.log('created new user');
    userId = newUser.userId;
    pwdSet = false;


  } else {
    // found the exisiting record
    // console.log('Found user from DB');
    userId = userInfo.userId;

    if(userInfo.userPwd == null || userInfo.userPwd == 'undefined'){
      pwdSet = false;
    }

    // console.log(userId);
    var setcmd = "userFirstname='" + userFirstname + "'";

    await User.updateProfile(setcmd, userId)
    .catch ((error) => {
      console.log('Err: updateProfile');
      err = true;
    });

    if(err){
      return res.status(500).end();
    }


    if(userLastname != null && userLastname != 'undefined'){

      // console.log(userLastname);

      var setcmd = "userLastname='" + userLastname + "'";
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
  return res.status(200).json({profile, pwdSet});

}

async function authApp (req, res){

  let email = req.body.userEmail;
  let pwd = req.body.userPwd;
  let err = false;
  
  if(email == 'undefined' || pwd == 'undefined' || email == null || pwd == null){
    // console.log('empty post body');
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
    return res.status(500).end();
  }
  
  // console.log(userId);

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

  // console.log(profile);

  var uuid = UidG.uuidCreate(email);
  req.session.uuid = uuid;

  // console.log(req.session.uuid);

  return res.status(200).json(profile);

}

module.exports = {
  authGoogle,
  authApp
}


