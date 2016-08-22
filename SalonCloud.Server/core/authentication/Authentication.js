/*
 *
 * Authentication Class
 *
 *
 */
"use strict";
var ErrorMessage = require('./../../routes/ErrorMessage');
const validator_1 = require('./../validator/validator');
var AuthenticationModel = require("./AuthenticationModel");
/**
* Authentication
*/
class Authentication {
    signUpWithEmailAndPassword(username, password, callback) {
        //validate username;
        if (!username) {
            callback(ErrorMessage.MissingUsername, 400, undefined);
            return;
        }
        else {
            var isPhonenumber = true;
            var isEmail = true;
            //case: username is phonenumber
            if (!validator_1.Validator.IsPhoneNumber(username)) {
                isPhonenumber = false;
            }
            //case: username is email
            if (!validator_1.Validator.IsEmail(username)) {
                isEmail = false;
            }
            if (!(isPhonenumber || isEmail)) {
                callback(ErrorMessage.NotEmailOrPhoneNumber, 400, undefined);
                return;
            }
        }
        //validate password;
        if (!password) {
            callback(ErrorMessage.MissingPassword, 400, undefined);
            return;
        }
        else {
            //validate password length, must be > = 6;
            if (password.length < 6) {
                callback(ErrorMessage.PasswordTooShort, 400, undefined);
                return;
            }
        }
        AuthenticationModel.register(new AuthenticationModel({
            'username': username,
            'status': true,
            'is_verified': false,
            'is_temporary': false
        }), password, function (err, account) {
            if (err) {
                callback({ 'err': err }, 409, undefined);
                return;
            }
            else {
                callback(undefined, 200, { 'user': account });
                return;
            }
        });
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map