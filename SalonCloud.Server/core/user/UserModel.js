/**
 *
 *
 *
 *
 */
"use strict";
const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
exports.UserProfileSchema = new mongoose.Schema({
    salon_id: { type: String, required: true },
    status: { type: Boolean, required: true },
    role: { type: Number, required: true },
    fullname: String,
    nickname: String,
    social_security_number: String,
    salary_rate: Number,
    cash_rate: Number,
    birthday: String,
    address: String,
    email: String
});
exports.UserSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [exports.UserProfileSchema]
});
exports.UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', exports.UserSchema);
//# sourceMappingURL=UserModel.js.map