var express = require('express');
const app = express();
//const dotenv = require ('dotenv').config();
//const cors = require('cors');
var router = express.Router();
//const port= 8000;
//app.listen(port, () => console.log(`server is running on port ${port}`));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
