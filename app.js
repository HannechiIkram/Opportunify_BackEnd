var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
const cors = require('cors');


var cookieParser = require('cookie-parser');
require('dotenv').config();




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



// Importation de la bibliothèque Mongoose
const mongoose = require('mongoose');
//const passport = require('passport'); // Import passport if not already imported


// Chargement de la configuration de la base de données depuis le fichier mongodb.json
const configDB = require('./database/mongodb.json');

// Configuration de la connexion à MongoDB ( avec promess )
mongoose.connect(configDB.mongo.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to DB !!");
}).catch((error) => {
  console.error("Error connecting to DB:", error);
});


// view engine setup
//app.use(passport.initialize());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST','PUT','DELETE'], // Allow only GET and POST requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
  credentials: true 



}));

app.use('/', indexRouter);
app.use('/user', usersRouter);


//les middleware eli teb3in jsonwebtoken
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
