"use strict";
/*
 *
 * Authentication Class
 *
 *
 */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
//import {IAuthentication} from './IAuthentication';
//import {IAuthModel} from './IAuthModel';
var Authentication = new Schema({
    username: String,
    password: String,
    fullname: String
});
Authentication.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', Authentication);
//# sourceMappingURL=Authentication.js.map