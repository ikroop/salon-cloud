"use strict";
const mongoose = require("mongoose");
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
//export const UserModel = mongoose.model<UserProfile>('Profile', UserProfileSchema); 
//# sourceMappingURL=UserProfile.js.map