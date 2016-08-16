"use strict";
/*
 *
 * Authentication Class
 *
 *
 */
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var Authentication = new Schema({
    username: String,
    password: String
});
Authentication.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', Authentication);
//# sourceMappingURL=Authentication.js.map