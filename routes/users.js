var express = require('express');
var router = express.Router();
const app = express();
const cors = require ('cors');
const {registerUser,loginUser}=require('../Controllers/UserController');


router.post('/register',  registerUser)
router.post('/login',  loginUser)
module.exports = router;
 