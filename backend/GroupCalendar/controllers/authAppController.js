var User = require('../models/user.js');
var UidG = require('./uuidGenerator.js');

exports.authGoogle = async function(req, res){

  let email = req.userEmail;
  let pwd = req.userPwd
  
  if(email === 'undefined' || pwd === 'undefined'){
    console.log('Err: empty post body');
    res.status(400).send('Empty email or password');

  }

  await User.login(email, password)
  .catch(error =>{
    throw error;
    res.status(400).send('Invalid email or password');
  })
  .then(result =>{
    var userId = result;
  })


  await User.getProfileById(userId)
  .catch ((error) => {
    throw error;
    res.status(400).send('Err: getProfileById');
  })
  .then (result => {
    console.log('got profile');
    var profile = result;
  });

  var uuid = UidG.uuidCreate(email);
  req.session.uuid = uuid;
  res.status(200).json(profile);

}