/*
 *
 * Authentication Class
 *
 *
 */
import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');
import Schema = mongoose.Schema;


import {IAuthentication} from './IAuthentication';
import {IAuthModel} from './IAuthModel';

var Authentication = new Schema({
    username: String,
    password: String
});

Authentication.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', Authentication);
