var express = require('express');
var router = express.Router();
const cors = require ('cors');
const { test, registerUser } = require('../Controllers/UserController');

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)
router.get('/', test);
/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post('/register', registerUser)
module.exports = router;
