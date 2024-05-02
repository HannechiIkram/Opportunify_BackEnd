// Importations
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const accessControl = require('../Opportunify_BackEnd/midill/accescontrol');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoconnection = require("./database/mongodb.json");
const cors = require('cors');
const evaluationRouter = require('./routes/evaluations');

const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes
const indexRouter = require('./routes/index');
const applicationRouter = require('./routes/application');
const userRouter = require('./routes/users');
const jobOfferRouter = require("./routes/job_offer");
const interviewRouter= require("./routes/Interview");
const app = express();

// Connexion à MongoDB
mongoose.connect(
  mongoconnection.url
)
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log(err);
});

// Configuration des middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation des routes
app.use('/', indexRouter);
app.use("/job_offer", jobOfferRouter);
app.use('/applications', applicationRouter);
app.use('/user', userRouter);
app.use('/evaluations', evaluationRouter);
app.use('/Interview',interviewRouter)

// Gestion des erreurs
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