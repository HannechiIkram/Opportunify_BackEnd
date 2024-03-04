var express = require('express');
var router = express.Router();

const {loginUser, registerUser}=require('../Controllers/UserController');
const {registerUserjobseeker}=require('../Controllers/User-jobseekerController');

router.post('/registeruser',registerUser)
router.post('/registerjobseeker',  registerUserjobseeker)
router.post('/login',  loginUser)
module.exports = router;
 