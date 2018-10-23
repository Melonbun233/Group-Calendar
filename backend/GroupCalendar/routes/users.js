var express = require('express');
var router = express.Router();

// require controller modules
var user_controller = require('../controllers/userController');

/* GET users listing. */
//router.get('/users', user_controller.user_info_get);
router.get('/', (req,res)=>{res.send('***In users router***')});
router.put('/', user_controller.user_info_put);
router.post('/', user_controller.user_id_post);
router.delete('/', user_controller.user_delete);

module.exports = router;
