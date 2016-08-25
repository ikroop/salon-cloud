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
const UserProfile_1 = require('../../modules/user/UserProfile');
exports.AuthenticationSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [UserProfile_1.UserProfileSchema]
});
exports.AuthenticationSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', exports.AuthenticationSchema);
//# sourceMappingURL=AuthenticationModel.js.map