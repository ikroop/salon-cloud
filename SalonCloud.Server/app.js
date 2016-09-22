"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local");
const schedule_1 = require("./routes/schedule");
const authentication_1 = require("./routes/authentication");
var UserModel = require("./core/user/UserModel");
const app = express();
//var authorizationRouter: AuthorizationRouter = new AuthorizationRouter();
// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
// passport config
var LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
app.get('/', (req, res) => {
    res.json({ "name": "SalonCloud Server" });
});
app.use((err, request, response, next) => {
    response.status(err.status || 500);
    response.json({
        error: "Server error"
    });
});
app.use("/api/v1/schedule", new schedule_1.ScheduleRouter().getRouter());
app.use("/api/v1/authentication", new authentication_1.AuthenticationRouter().getRouter());
const server = app.listen(3000, function () {
    console.log("OMG!!! NO BUGS! SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.server = server;
//# sourceMappingURL=app.js.map