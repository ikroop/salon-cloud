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
var Account = new Schema({
    username: String,
    password: String
});
Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
//# sourceMappingURL=Authentication.js.map