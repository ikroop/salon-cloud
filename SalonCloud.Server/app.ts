import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as http from "http";

import { ScheduleRouter } from "./routes/schedule";

/*var AuthRoute = require ("./routes/authentication");
var SalonRoute = require("./routes/salon");
var ScheduleRoute = require("./routes/schedule");
var UserRoute = require ("./routes/user"); 
var AuthenticationModel = require ("./core/authentication/AuthenticationModel");*/

const app: express.Application = express();

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

app.use((err: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {

    response.status(err.status || 500);
    response.json({
        error: "Server error"
    })
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
app.use("/api/v1/schedule", new ScheduleRouter().getRouter());

const server: http.Server = app.listen(3000, function () {
    console.log("OMG!!! NO BUGS! SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});

export { server };