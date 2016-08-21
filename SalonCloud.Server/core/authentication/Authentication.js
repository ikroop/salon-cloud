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
    username: { type: String, required: true },
    password: String,
    fullname: { type: String, required: true },
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    birthday: String,
    address: String
});
Authentication.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', Authentication);
//# sourceMappingURL=Authentication.js.map