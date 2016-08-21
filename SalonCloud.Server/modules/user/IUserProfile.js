"use strict";
const mongoose = require("mongoose");
exports.UserProfileSchema = new mongoose.Schema({
    salon_id: String,
    status: Boolean,
    role: Number,
    fullname: String,
    nickname: String,
    social_security_number: String,
    salary_rate: Number,
    cash_rate: Number,
    birthday: String,
    address: String,
    email: String
});
exports.UserModel = mongoose.model('Profile', exports.UserProfileSchema);
//# sourceMappingURL=IUserProfile.js.map