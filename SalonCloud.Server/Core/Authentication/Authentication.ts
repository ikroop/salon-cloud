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

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
