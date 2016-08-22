import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportLocal from "passport-local";
var AuthRoute = require ("./routes/authentication");
var SalonRoute = require("./routes/salon");
var ScheduleRoute = require("./routes/schedule");
var AuthenticationModel = require ("./core/authentication/AuthenticationModel");
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
app.post('/auth/signupwithemailandpassword', AuthRoute.SignUpWithEmailAndPassword);
app.post('/auth/SigninWithEmailAndPassword', AuthRoute.SignInWithEmailAndPassword);

//Salon
app.post('/salon/createinformation', AuthRoute.VerifyToken, SalonRoute.CreateInformation);

//Schedule
app.get('/schedule/getsalondailyschedules', AuthRoute.VerifyToken, ScheduleRoute.GetSalonDailySchedule);
app.get('/schedule/getemployeedailyschedules', AuthRoute.VerifyToken, ScheduleRoute.GetEmployeeDailySchedule);

app.listen(3000, function () {
    console.log("SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});

export var App = app;