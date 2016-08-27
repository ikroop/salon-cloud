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
const UserModel_1 = require('../../modules/user/UserModel');
exports.AuthenticationSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [UserModel_1.UserProfileSchema]
});
exports.AuthenticationSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', exports.AuthenticationSchema);
//# sourceMappingURL=AuthenticationModel.js.map