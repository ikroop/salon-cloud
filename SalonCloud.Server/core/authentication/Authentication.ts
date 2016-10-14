/**
 * 
 * 
 * 
 * 
 */

import { SalonCloudResponse } from "./../SalonCloudResponse";
import { AuthenticationBehavior } from "./AuthenticationBehavior";
import { ErrorMessage } from './../ErrorMessage';
import { UserModel } from "./../../modules/userManagement/UserModel";

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

    /**
     * signUpWithUsernameAndPassword
     * create new user with username (phone or email) & password
     * @param : 
     *     Error: validation Error
     *     Successful: 
     *             {
     *                  user:{
     *                     username: string
     *                     status: boolean
     *                     id: string
     *                  }
     *             }
     * @returns {DailyDayData}
     */
    public async signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<any>> {
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

        // Kill callback function
        let promise = new Promise<SalonCloudResponse<any>>(function (resolve, reject) {
            UserModel.register(new UserModel({
                'username': username,
                'status': true,
                'is_verified': false,
                'is_temporary': false,
            }), password, function (err, account) {
                if (err) {
                    response.err = { 'err': err };
                    response.code = 409;
                    response.data = undefined;
                } else {
                    response.err = undefined;
                    response.code = 200;
                    response.data = {
                        'user': {
                            'username': account.username,
                            'status': account.status,
                            '_id': account._id
                        }
                    };
                }
                resolve(response);
            });
        });
        return promise;

    }

    /**
     * signInWithUsernameAndPassword
     * Sign In with username & password
     * @param : 
     *     Error: Validation Error
     *     Successful: 
     *             {
     *                  user:{
     *                     username: string
     *                     status: boolean
     *                     id: string
     *                  },
     *                  auth:{
     *                     token: string
     *                  }
     *             }
     * @returns {DailyDayData}
     */
    public async signInWithUsernameAndPassword(username: string, password: string) {

        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        // Validate Username
        var usernameValidator = new BaseValidator(username);
        usernameValidator = new MissingCheck(usernameValidator, ErrorMessage.MissingUsername);
        var usernameResult = await usernameValidator.validate();
        if (usernameResult) {
            response.err = usernameResult;
            response.code = 400;
            return response;
        }

        // Validate password;
        var passwordValidator = new BaseValidator(password);
        passwordValidator = new MissingCheck(passwordValidator, ErrorMessage.MissingPassword);
        var passwordResult = await passwordValidator.validate();
        if (passwordResult) {
            response.err = passwordResult;
            response.code = 400;
            return response;
        }
        let promise = new Promise(function (resolve, reject) {
            UserModel.authenticate('local', { session: false })(username, password, function (err, user, options) {
                if (err) {
                    response.err = { 'err': err };
                    response.code = 409;
                    response.data = undefined;
                }
                if (user === false) {
                    response.err = ErrorMessage.SignInFailed;
                    response.code = 403;
                    response.data = undefined;
                } else {
                    var created_at = new Date().getTime();
                    var cert = fs.readFileSync('./config/dev/private.key');  // get private key

                    var UserToken = {
                        _id: user._id,
                        username: user.username,
                        status: user.status
                    };

                    var token = jwt.sign(UserToken, cert, { algorithm: 'RS256' });
                    response.err = undefined;
                    response.code = 200;
                    response.data = {
                        user: UserToken,
                        auth: {
                            token: token
                        }
                    };
                    console.log('UserToken:', UserToken);
                    console.log('token:', token);
                }
                resolve(response);

            });
        });
        return promise;
    }

    /**
     * signUpWithUsernameAndPassword
     * create new user with username (phone or email) & auto generation password
     * @param : 
     *     Error: validation Error
     *     Successful: 
     *             {
     *                  user:{
     *                     username: string
     *                     status: boolean
     *                     id: string
     *                  }
     *             }
     * @returns {DailyDayData}
     */
    public async signUpWithAutoGeneratedPassword(username: string): Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            err: undefined,
            data: undefined
        }
        var randomPassword = Math.floor(Math.random() * 1000000);
        var randomPasswordString = randomPassword.toString();
        var registerProcess = await this.signUpWithUsernameAndPassword(username, randomPasswordString);
        if (registerProcess.err) {
            response.err = registerProcess.err;
            response.code = 409;
            return response;
        } else {
            response.data = registerProcess.data;
            response.data.password = randomPasswordString;
            response.code = 200;
            return response;
        }
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