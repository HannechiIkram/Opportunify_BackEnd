var express = require('express');
var router = express.Router();

const {loginUser, registerUserjobseeker}=require('../Controllers/UserController');


router.post('/registerjobseeker',  registerUserjobseeker)
router.post('/login',  loginUser)
module.exports = router;
 