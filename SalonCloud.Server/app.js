"use strict";
const express = require('express');
const routes = require('./routes/index');
const user = require('./routes/user');
const register = require('./routes/authentication');
const http = require('http');
const path = require('path');
const mongoose = require("mongoose");
const passport = require('passport');
const passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
// connect to database
var configDB = require('./Config/dev/database.js');
mongoose.connect(configDB.url);
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
const stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
const Authentication = require('./Core/Authentication/Authentication');
passport.use(new LocalStrategy(Authentication.authenticate()));
passport.serializeUser(Authentication.serializeUser());
passport.deserializeUser(Authentication.deserializeUser());
var index = new routes.Index();
app.get('/', routes.Index.index);
app.get('/users', user.list);
app.get('/register', register.Authentication.registerGet);
app.post('/register', register.Authentication.registerPost);
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map