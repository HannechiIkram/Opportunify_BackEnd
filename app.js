var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const accessControl = require('../Opportunify_BackEnd/midill/accescontrol');

const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Importez Mongoose ici
const mongoconnection = require("./database/mongodb.json");
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config();
var indexRouter = require('./routes/index');
var applicationRouter = require('./routes/application');
var userRouter = require('./routes/users');
var app = express();


// Connexion à la base de données MongoDB avec Mongoose
mongoose.connect(
  mongoconnection.url, 
  ///no need for these
  /*{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }*/
)
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log(err);
});
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);


//les middleware eli teb3in jsonwebtoken
app.use('/applications', applicationRouter);
app.use('/user',userRouter);
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.title = 'Error';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

