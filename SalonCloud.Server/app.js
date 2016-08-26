"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
var AuthRoute = require("./routes/authentication");
var SalonRoute = require("./routes/salon");
var ScheduleRoute = require("./routes/schedule");
var UserRoute = require("./routes/user");
var AuthenticationModel = require("./core/authentication/AuthenticationModel");
var app = express();
// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
// passport config
var LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(AuthenticationModel.authenticate()));
passport.serializeUser(AuthenticationModel.serializeUser());
passport.deserializeUser(AuthenticationModel.deserializeUser());
var env = process.env.NODE_ENV || 'development';
// connect to database
var configDB = require('./config/dev/database.js');
mongoose.connect(configDB.url);
if (env === 'development') {
    app.use(errorHandler());
}
app.get('/', (req, res) => {
    res.json({ 'test': 'ok' });
});
//Authentication
app.post('/auth/signupwithemailandpassword', AuthRoute.signUpWithEmailAndPassword);
app.post('/auth/SigninWithEmailAndPassword', AuthRoute.signInWithEmailAndPassword);
//User
app.post('/user/createProfile', AuthRoute.verifyToken, UserRoute.createProfile);
//Salon
app.post('/salon/createinformation', AuthRoute.verifyToken, SalonRoute.createInformation);
//Schedule
app.get('/schedule/getsalondailyschedules', AuthRoute.verifyToken, ScheduleRoute.getSalonDailySchedule);
app.get('/schedule/getemployeedailyschedules', AuthRoute.verifyToken, ScheduleRoute.getEmployeeDailySchedule);
app.post('/schedule/insertsalonweeklyschedule', AuthRoute.verifyToken, ScheduleRoute.insertSalonWeeklySchedule);
app.post('/schedule/insertsalondailyschedule', AuthRoute.verifyToken, ScheduleRoute.insertSalonDailySchedule);
app.listen(3000, function () {
    console.log("SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.App = app;
//# sourceMappingURL=app.js.map