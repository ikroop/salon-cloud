"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
var AnomymousRoute = require("./routes/Anomymous");
var AuthenticationRoute = require("./routes/Authentication");
var UserModel = require("./core/user/UserModel");
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
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
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
app.post('/auth/signupwithemailandpassword', AnomymousRoute.signUpWithEmailAndPassword);
app.post('/auth/SigninWithEmailAndPassword', AnomymousRoute.signInWithEmailAndPassword);
//User
//app.post('/user/createProfile', AuthenticationRoute.verifyToken, UserRoute.createProfile);
//Salon
//app.post('/salon/createinformation', AuthenticationRoute.verifyToken, SalonRoute.createInformation);
//Schedule
//app.get('/schedule/getsalondailyschedules', AuthenticationRoute.verifyToken, ScheduleRoute.getSalonDailySchedule);
//app.get('/schedule/getemployeedailyschedules', AuthenticationRoute.verifyToken, ScheduleRoute.getEmployeeDailySchedule);
//app.post('/schedule/insertsalonweeklyschedule', AuthenticationRoute.verifyToken, ScheduleRoute.insertSalonWeeklySchedule);
//app.post('/schedule/insertsalondailyschedule', AuthenticationRoute.verifyToken, ScheduleRoute.insertSalonDailySchedule);
app.listen(3000, function () {
    console.log("SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.App = app;
//# sourceMappingURL=app.js.map