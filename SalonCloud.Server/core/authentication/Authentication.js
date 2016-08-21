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
const IUserProfile_1 = require('../../modules/user/IUserProfile');
var Authentication = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [IUserProfile_1.UserProfileSchema]
});
Authentication.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', Authentication);
//# sourceMappingURL=Authentication.js.map