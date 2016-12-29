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


import { UserToken } from './AuthenticationData';
import { firebase } from './../../Services/Firebase';

export class FirebaseAuthenticationDatabase implements AuthenticationDatabaseInterface {
    public async signInWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        let promise = new Promise<SalonCloudResponse<UserToken>>(function (resolve, reject) {
            firebase.auth().signInWithEmailAndPassword(username, password)
                .then(function (user) {

                    user.getToken().then(function (token) {
                        response.code = 200;
                        var userToken: UserToken = {
                            user: {
                                _id: user.uid,
                                username: user.email,
                                status: true
                            },
                            auth: {
                                token: token
                            }
                        };

                        response.data = userToken;
                        resolve(response);
                    });

                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        response.code = 403;
                        response.err = ErrorMessage.SignInFailed;
                    } else {
                        response.code = 400;
                        response.err = ErrorMessage.Unknown;
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

        let promise = new Promise<SalonCloudResponse<undefined>>(function (resolve, reject) {
            firebase.auth().createUserWithEmailAndPassword(username, password).then(function (user) {
                response.code = 200;
                resolve(response);
            }, function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    response.code = 409;
                    response.err = ErrorMessage.UsernameAlreadyExists;
                } else if (errorCode == 'auth/operation-not-allowed') {
                    response.code = 400;
                    response.err = ErrorMessage.UserBlocked;
                } else {
                    response.code = 400;
                    response.err = ErrorMessage.Unknown;
                }
                resolve(response);
            });
        });
        return promise;
    }

    verifyToken(token: string) {

    }
}