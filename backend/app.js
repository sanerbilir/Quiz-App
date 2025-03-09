require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var mongoose = require('mongoose');

var authRoutes = require('./routes/authRoutes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var quizRouter = require('./routes/quizRoutes'); 
var app = express();

// Database connection
var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error:"));

// Session setup with MongoDB storage
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoDB })
}));

// Passport initialization
require('./config/passport-config');
app.use(passport.initialize());
app.use(passport.session());


// Additional middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup
var cors = require('cors');
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:3001']
}));

// Routes
app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/users', usersRouter);
app.use('/quiz', quizRouter);

// Error handling
app.use(function(req, res, next) { next(createError(404)); });
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(res.locals.error);
});

module.exports = app;
