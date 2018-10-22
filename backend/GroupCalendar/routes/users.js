var express = require('express');
var router = express.Router();

// require controller modules
var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/users', user_controller.user_info_get);
router.put('/users', user_controller.user_info_put);
router.post('/users', user_controller.user_id_post);
router.delete('/users', user_controller.user_delete);

module.exports = router;
