import express = require('express');
import routes = require('./routes/index');
import user = require('./routes/user');
import AuthenticationRoute = require('./routes/authentication');
import http = require('http');
import path = require('path');
import mongoose = require('mongoose');
import passport = require('passport');
import passportLocal = require('passport-local');
import Authentication = require('./core/authentication/Authentication');

var LocalStrategy = passportLocal.Strategy;

 // connect to database
var configDB = require('./config/dev/database.js');
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

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
passport.use(new LocalStrategy(Authentication.authenticate()));
passport.serializeUser(Authentication.serializeUser());
passport.deserializeUser(Authentication.deserializeUser());

var index: routes.Index = new routes.Index();
app.get('/', routes.Index.index);
app.get('/users', user.list);
app.post('/auth/register', AuthenticationRoute.registerPost);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
