var express = require('express');
var router = express.Router();

const {registerUserjobseeker}=require('../Controllers/User-jobseekerController');

router.post('/registeruser',registerUser)
router.post('/registerjobseeker',  registerUserjobseeker)
module.exports = router;
 