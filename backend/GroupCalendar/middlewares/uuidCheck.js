exports.uuidCheck = function(req, res, next){
	if (req.session.uuid == 'undefined'){
		res.status(401).send("expired session");
	} else {
		next();
	}
};