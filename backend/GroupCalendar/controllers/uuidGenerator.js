/*
 * this function could create a uuid based on a given string
 * the string could be the user_email
 * the generator namespace is a random uuid to be used as a random key
 * ...(more specification comming)
 */

 // npm install uuid
 // https://www.npmjs.com/package/uuid

//random uuid
const uuidv4 = require('uuid/v4');
//uuid with namespace
const uuidv5 = require('uuid/v5');

exports.uuidCreate = function(userEmail, uuid){
	var key = uuidv4();
	uuid = uuidv5(userEmail. key);
};
