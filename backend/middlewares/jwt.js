var jwt = require('jsonwebtoken');
const key = 'whatever';

exports.newToken = function(data){
	return jwt.sign({data: data}, key);
}

exports.verifyToken = function(req, res, next){
	var token = req.body.uuid;
	console.log(token);
	jwt.verify(token, key, (err, decoded) => {
		if (err)
			res.status(403).json({error: "Forbidden"})
		else 
			next();
	})
}