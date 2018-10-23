var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/users', function(req, res) {
	//res.redirect('/users');
	res.send("***in index.js***");
});

module.exports = router;
