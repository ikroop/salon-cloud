/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../SalonCloudResponse';
import { AuthenticationBehavior } from './AuthenticationBehavior';
import { ErrorMessage } from './../ErrorMessage';
import UserModel = require('./../../Modules/UserManagement/UserModel');
import { IUserData, UserData, UserProfile } from './../../Modules/UserManagement/UserData'
import jwt = require('jsonwebtoken');
import fs = require('fs');
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsString, IsLengthGreaterThan, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidUserName }
    from './../../Core/Validation/ValidationDecorators';
import { UserToken } from './AuthenticationData';

export class Authentication implements AuthenticationBehavior {

    changePassword(oldPasswords: string, newPassword: string, code: string) {

    }

    sendVerifyCode(username: string) {
        var response: SalonCloudResponse<boolean>;

        return response;
    }

    /**
      * @method signUpWithUsernameAndPassword
      * @description create new user with username (phone or email) & password
      * @param {string} username
      * @param {string} password
      * @returns {Promise<SalonCloudResponse<any>>}
      *      Error:  - validation Error, code: 400
      *              - username is existing already, code: 409                    
      *      Successful: 
      *              - code: 200
      * @memberOf Authentication
      */
    public async signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<undefined>> {
        var response: SalonCloudResponse<undefined> = {
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

        var user: UserData = {
            username: username,
            status: true,
            is_verified: false,
            is_temporary: false
        };

        let promise = new Promise<SalonCloudResponse<undefined>>(function (resolve, reject) {
            UserModel.register(new UserModel(user), password, function (err) {
                if (err) {
                    response.err = { 'err': err };
                    response.code = 409;
                    response.data = undefined;
                } else {
                    response.err = undefined;
                    response.code = 200;
                }
                resolve(response);
            });
        });
        return promise;

    }

    /**
     * @method signInWithUsernameAndPassword
     * Sign In with username & password
     * @param {string} username
     * @param {string} password
     * @returns
     *      Error:  - Validation Error, code: 400
     *              - Username or Password is wrong, code: 403
     *              - Another: code 409
     *      Successful: 
     *             {
     *                  user:{
     *                     username: string
     *                     status: boolean
     *                     _id: string
     *                  },
     *                  auth:{
     *                     token: string
     *                  }
     *             }
     * @memberOf Authentication
     */
    public async signInWithUsernameAndPassword(username: string, password: string):Promise<SalonCloudResponse<UserToken>> {

        var response: SalonCloudResponse<UserToken> = {
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
        let promise = new Promise<SalonCloudResponse<UserToken>>(function (resolve, reject) {

            UserModel.authenticate()(username, password, function (err: any, user: IUserData, error: any) {
                if (err) {
                    response.err = { 'err': err };
                    response.code = 409;
                    response.data = undefined;
                }
                if (!user) {
                    response.err = ErrorMessage.SignInFailed;
                    response.code = 403;
                    response.data = undefined;
                } else {
                    var created_at = new Date().getTime();
                    var cert = fs.readFileSync('./Config/Dev/Private.key');  // get private key

                    var userToken:UserToken = {
                        user: {
                            _id: user._id,
                            username: user.username,
                            status: user.status
                        },
                         auth: {
                            token: undefined
                        }
                    };

                    var token = jwt.sign(userToken.user, cert, { algorithm: 'RS256' });
                    userToken.auth.token = token;
                    response.err = undefined;
                    response.code = 200;
                    response.data = userToken
                }
                resolve(response);

            });
        });
        return promise;
    }    

    /**
     * @method verifyToken
     * @description verify User Token
     * @param {string} token
     * @returns
     *     {undefined} User Token is undefined.
     *     {SalonCloudResponse} code 403, error = 'InvalidToken' || code 200, data = { _id: string, username: string, status: boolean }
     * @memberOf Authentication
     */
    public verifyToken(token: string) {
        var response: any = {};
        let promise = new Promise(function (resolve, reject) {

            if (!token) {
                response = undefined;
            } else {
                var cert = fs.readFileSync('./Config/Dev/Public.pem');  // get private key
                jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
                    if (err) {
                        response.err = ErrorMessage.InvalidTokenError;
                        response.code = 401;
                        response.data = undefined;
                    } else {
                        response.err = undefined;
                        response.code = 200;
                        response.data = payload;
                    }
                });
            }
            resolve(response);
        });
        return promise;
    }
}
