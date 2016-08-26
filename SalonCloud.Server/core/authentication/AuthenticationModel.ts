/*
 *
 * Authentication Class
 *
 *
 */
import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');
import Schema = mongoose.Schema;
import {UserProfileSchema} from '../../modules/user/UserProfile';
import {AuthenticationData} from'./AuthenticationData';
export const AuthenticationSchema = new Schema({
    username: { type: String, required: true },
    password: String,
    status: { type: Boolean, required: true },
    is_verified: { type: Boolean, required: true },
    is_temporary: { type: Boolean, required: true },
    profile: [UserProfileSchema]
});

AuthenticationSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model<AuthenticationData>('User', AuthenticationSchema);
