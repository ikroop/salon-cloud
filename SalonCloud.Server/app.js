"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
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
app.use(app.router);
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
app.listen(3000, function () {
    console.log("SalonCloud server listening on port %d in %s mode", 3000, app.settings.env);
});
exports.App = app;
//# sourceMappingURL=app.js.map