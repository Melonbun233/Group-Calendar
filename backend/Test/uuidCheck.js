exports uuidCheck = function(){
	return function(req, res, next){
		if (req.session.uuid == 'undefined'){
			res.status(401).send("expired session");
		} else {
			next();
		}
	}
};