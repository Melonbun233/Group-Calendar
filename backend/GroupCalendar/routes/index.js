var express = require('express');
var router = express.Router();

console.log("npm installed!");

/* GET home page. */
router.get('/', function(req, res) {
	res.send('***in index.js***');
});

module.exports = router;
