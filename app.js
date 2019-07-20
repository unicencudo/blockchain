var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var lenderRouter = require('./routes/lender');
// var registerRouter = require('./routes/register');
var LoanRequestRouter = require('./routes/LoanRequest');
var LoanTermAcceptanceRouter = require('./routes/LoanTermAcceptance');
var FundingRouter = require('./routes/Funding');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/LoanRequest', LoanRequestRouter);
app.use('/LoanTermAcceptance', LoanTermAcceptanceRouter);
app.use('/Funding', FundingRouter);
// app.use('/users', usersRouter);
// app.use('/lender', lenderRouter);
// app.use('/register', registerRouter);
app.use(express.static("public"));
app.use(express.static("contracts/build/contracts"));
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
