"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const schedule_1 = require("./routes/schedule");
/*var AuthRoute = require ("./routes/authentication");
var SalonRoute = require("./routes/salon");
var ScheduleRoute = require("./routes/schedule");
var UserRoute = require ("./routes/user");
var AuthenticationModel = require ("./core/authentication/AuthenticationModel");*/
const app = express();
// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*app.use(passport.initialize());
app.use(passport.session());

// passport config
var LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(AuthenticationModel.authenticate()));
passport.serializeUser(AuthenticationModel.serializeUser());
passport.deserializeUser(AuthenticationModel.deserializeUser());*/
app.get('/', (req, res) => {
    res.json({ 'name': 'SalonCloud Server' });
});
app.use((err, request, response, next) => {
    response.status(err.status || 500);
    response.json({
        error: "Server error"
    });
});
//Authentication
/*app.post('/auth/signupwithemailandpassword', AuthRoute.signUpWithEmailAndPassword);
app.post('/auth/SigninWithEmailAndPassword', AuthRoute.signInWithEmailAndPassword);

//User
app.post('/user/createProfile', AuthRoute.verifyToken, UserRoute.createProfile);

//Salon
app.post('/salon/createinformation', AuthRoute.verifyToken, SalonRoute.createInformation);

//Schedule
app.get('/schedule/getsalondailyschedules', AuthRoute.verifyToken, ScheduleRoute.getSalonDailySchedule);
app.get('/schedule/getemployeedailyschedules', AuthRoute.verifyToken, ScheduleRoute.getEmployeeDailySchedule);
app.post('/schedule/insertsalonweeklyschedule', AuthRoute.verifyToken, ScheduleRoute.insertSalonWeeklySchedule);
app.post('/schedule/insertsalondailyschedule', AuthRoute.verifyToken, ScheduleRoute.insertSalonDailySchedule);*/
app.use("/api/v1/schedule", new schedule_1.ScheduleRouter().getRouter());
const server = app.listen(3000, function () {
    console.log("OMG!!! NO BUGS! SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.server = server;
//# sourceMappingURL=app.js.map