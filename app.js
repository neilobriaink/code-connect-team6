var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRouter = require('./routes/employees');
var rolesRouter = require('./routes/roles')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const session = require("express-session");

app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  next();
});

function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }
  next();
}

// PUBLIC ROUTES (no login required)
app.use('/users', usersRouter);

// Public landing page
app.use('/', indexRouter);

// PROTECTED ROUTES (login required)
app.use('/users', requireLogin, usersRouter);
app.use('/employees', requireLogin, employeesRouter);
app.use('/roles', requireLogin, rolesRouter);




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