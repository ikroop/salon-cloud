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
var Authentication = new Schema({
    username: {type: String, required: true},
    password: String,
    status: {type: Boolean, required: true},
    is_verified: {type: Boolean, required: true},
    is_temporary: {type: Boolean, required: true},
    profile: [UserProfileSchema]
});

Authentication.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', Authentication);
