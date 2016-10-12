/**
 * 
 * 
 * 
 * 
 */

import {UserData} from "./UserData";
import { mongoose } from "../../services/database";

import passportLocalMongoose = require('passport-local-mongoose');
import Schema = mongoose.Schema;

export const UserProfileSchema = new mongoose.Schema({
    salon_id: { type: String, required: true },
    status: { type: Boolean, required: true },
    role: { type: Number, required: true },
    fullname: {type: String, require: true},
    nickname: {type: String, require: true},
    social_security_number: String,
    salary_rate: Number,
    cash_rate: Number,
    birthday: String,
    address: String,
    email: String

});

export const UserSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [UserProfileSchema]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model<UserData>('User', UserSchema);
