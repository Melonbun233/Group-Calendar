var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res){
	user_controller.user_info_get(req.body, res);
});

router.put('/', user_controller.user_info_put);
router.post('/', user_controller.user_id_post);
router.delete('/', user_controller.user_delete);

module.exports = router;
