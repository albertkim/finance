express = require('express');
router = express.Router();
session = require("cookie-session");
bcrypt = require("bcrypt-nodejs");
async = require("async");
_ = require("underscore");
feedParser = require('feedparser');
http = require('http');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");

mongoose = require("mongoose");

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var stockActions = require("./routes/stockActions");
var portfolioActions = require("./routes/portfolioActions");
var loginActions = require("./routes/loginActions");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Mongodb connectivity
mongoose.connect("mongodb://localhost:27017/finance");

// Require all files in /models directory
fs.readdirSync(__dirname + "/models").forEach(function(filename){
  if(~filename.indexOf(".js")){
    require(__dirname + "/models/" + filename);
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  keys: ['key1', 'key2'],
}));

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

app.use("/", routes);
app.use("/users", users);
app.use("/register", register);

app.get("/allUsers", loginActions.showAllUsers);
app.get("/logout", loginActions.logout);

app.post("/login", loginActions.login);
app.post("/logout", loginActions.logout);
app.post("/addStock", stockActions.addStock);
app.post("/deleteStock", stockActions.deleteStock);
app.post("/reorderStocks", stockActions.reorderStocks);
app.post("/getNews", stockActions.getNews);
app.post("/addPortfolio", portfolioActions.addPortfolio);
app.post("/deletePortfolio", portfolioActions.deletePortfolio);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;