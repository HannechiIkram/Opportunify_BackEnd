const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const accessControl = require("./midill/accescontrol");
const twilio = require("twilio");

const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Importez Mongoose ici
const mongoconnection = require("./database/mongodb.json");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const indexRouter = require("./routes/index");
const applicationRouter = require("./routes/application");
const userRouter = require("./routes/users");
const evaluationRouter = require("./routes/evaluations");
const statusRouter = require("./routes/statusRoutes");
const app = express();

//const crypto = require('crypto');
//const randomHexString = crypto.randomBytes(64).toString('hex');
//console.log(randomHexString);

// Connexion à la base de données MongoDB avec Mongoose
require("dotenv").config(); // Load environment variables from .env file


const uri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI
    : "mongodb://root:example@db:27017/pi";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
const jobOfferRouter = require("./routes/job_offer");

app.use("/job_offer", jobOfferRouter);
app.use("/evaluations", evaluationRouter);
app.use("/status", statusRouter);

//les middleware eli teb3in jsonwebtoken
app.use("/applications", applicationRouter);
app.use("/user", userRouter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.title = "Error";
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
