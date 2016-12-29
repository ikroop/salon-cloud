/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../SalonCloudResponse';
import { AuthenticationDatabaseInterface } from './AuthenticationDatabaseInterface';
import { ErrorMessage } from './../ErrorMessage';
import UserModel = require('./../../Modules/UserManagement/UserModel');
import { IUserData, UserData, UserProfile } from './../../Modules/UserManagement/UserData'
import jwt = require('jsonwebtoken');
import fs = require('fs');

import { UserToken } from './AuthenticationData';
import * as FirebaseAdmin from "firebase-admin";
import * as FirebaseClient from "firebase-client";

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

    verifyToken(token: string) {

    }
}