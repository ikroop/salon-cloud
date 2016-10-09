/**
 * 
 * 
 * 
 * 
 */

import { SalonCloudResponse } from "./../SalonCloudResponse";
import { AuthenticationBehavior } from "./AuthenticationBehavior";
import { ErrorMessage } from './../ErrorMessage';
var UserModel = require('./../../modules/userManagement/UserModel');
import jwt = require('jsonwebtoken');
import fs = require('fs');
import { BaseValidator } from "./../../core/validation/BaseValidator";
import { MissingCheck, IsString, IsLengthGreaterThan, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidUserName }
    from "./../../core/validation/ValidationDecorators";

export class Authentication implements AuthenticationBehavior {
    changePassword(oldPasswords: string, newPassword: string, code: string, callback) {

    }

    sendVerifyCode(username: string, callback) {
        var response: SalonCloudResponse<boolean>;

        return response;
    }
    public async signUpWithUsernameAndPassword(username: string, password: string) {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        // Validate Username
        var usernameValidator = new BaseValidator(username);
        usernameValidator = new MissingCheck(usernameValidator, ErrorMessage.MissingUsername);
        usernameValidator = new IsValidUserName(usernameValidator, ErrorMessage.NotEmailOrPhoneNumber);
        var usernameResult = await usernameValidator.validate();
        if (usernameResult) {
            response.err = usernameResult;
            response.code = 400;
            return response;
        }

        // Validate password;
        var passwordValidator = new BaseValidator(password);
        passwordValidator = new MissingCheck(passwordValidator, ErrorMessage.MissingPassword);
        passwordValidator = new IsLengthGreaterThan(passwordValidator, ErrorMessage.PasswordTooShort, 6);
        var passwordResult = await passwordValidator.validate();
        if (passwordResult) {
            response.err = passwordResult;
            response.code = 400;
            return response;
        }

        await UserModel.register(new UserModel({
            'username': username,
            'status': true,
            'is_verified': false,
            'is_temporary': false
        }), password, function (err, account) {
            if (err) {
                //callback({ 'err': err }, 409, undefined);
                response.err = err;
                response.code = 409;
                response.data = undefined;
            } else {
                response.err = undefined;
                response.code = 200;
                response.data = {
                    'user': account
                };
            }
        });
        return response;
    }

    public signInWithUsernameAndPassword(username: string, password: string, callback) {
        if (!username) {
            callback(ErrorMessage.MissingUsername, 400, undefined);
            return;
        }
        if (!password) {
            callback(ErrorMessage.MissingPassword, 400, undefined);
            return;
        }

        UserModel.authenticate('local', { session: false })(username, password, function (err, user, options) {
            if (err) {
                callback({ 'err': err }, 403, undefined);
                return;
            }
            if (user === false) {
                callback(ErrorMessage.SignInFailed, 403, undefined);
                return;
            } else {
                var created_at = new Date().getTime();
                var cert = fs.readFileSync('./config/dev/private.key');  // get private key

                var UserToken = {
                    _id: user._id,
                    username: user.username,
                    status: user.status
                };

                var token = jwt.sign(UserToken, cert, { algorithm: 'RS256' });
                callback(undefined, 200, {
                    user: UserToken,
                    auth: {
                        token: token
                    }
                });
                return;
            }
        });
    }
    /**
     * Check access TOKEN in Request
     * Push user(id, iat, ...) to req.user
     */
    public verifyToken(token: string, callback) {
        if (!token) {
            callback(ErrorMessage.InvalidTokenError, 403, undefined);
            return;
        } else {
            var cert = fs.readFileSync('./config/dev/public.pem');  // get private key
            jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
                if (err) {
                    callback(ErrorMessage.InvalidTokenError, 403, undefined);
                    return;
                } else {
                    callback(undefined, 200, payload);
                    return;
                }
            });
        }
    }
}