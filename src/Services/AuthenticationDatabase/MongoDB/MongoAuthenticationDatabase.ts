/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { AuthenticationDatabaseInterface } from './../AuthenticationDatabaseInterface';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import UserModel = require('./../../UserDatabase/MongoDB/UserModel');
import { IUserData, UserData, UserProfile } from './../../../Modules/UserManagement/UserData'
import jwt = require('jsonwebtoken');
import fs = require('fs');

import { UserToken } from './../../../Core/Authentication/AuthenticationData';

export class MongoAuthenticationDatabase implements AuthenticationDatabaseInterface {
    public async signInWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
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

                    var userToken: UserToken = {
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


    public async signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<undefined>> {
        var response: SalonCloudResponse<undefined> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        var user: UserData = {
            username: username,
            status: true,
            is_verified: false,
            is_temporary: false
        };


        let promise = new Promise<SalonCloudResponse<undefined>>(function (resolve, reject) {
            UserModel.register(new UserModel(user), password, function (err) {
                if (err) {
                    response.err = ErrorMessage.UsernameAlreadyExists;
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
     * @method verifyToken
     * @description verify User Token
     * @param {string} token
     * @returns
     *     {undefined} User Token is undefined.
     *     {SalonCloudResponse} code 403, error = 'InvalidToken' || code 200, data = { _id: string, username: string, status: boolean }
     * @memberOf Authentication
     */
    public async verifyToken(token: string) {
        var response: any = {};
        let promise = new Promise(function (resolve, reject) {

            if (!token) {
                response = undefined;
                resolve(response);
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