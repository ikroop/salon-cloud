/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { AuthenticationDatabaseInterface } from './../AuthenticationDatabaseInterface';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { IUserData, UserData, UserProfile } from './../../../Modules/UserManagement/UserData'

import { UserToken } from './../../../Core/Authentication/AuthenticationData';
import { FirebaseUserManagement } from './../../UserDatabase/Firebase/FirebaseUserManagement';

import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';

export class FirebaseAuthenticationDatabase implements AuthenticationDatabaseInterface {


    /**
     * 
     * 
     * @param {string} username
     * @param {string} password
     * @returns {Promise<SalonCloudResponse<UserToken>>}
     * 
     * @memberOf FirebaseAuthenticationDatabase
     */
    public async signInWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: null,
            data: null,
            err: null
        };

        var phoneNumber: string = null;
        var email: string = null;
        var phoneReg = /^\d{10}$/;
        if (username.match(phoneReg)) {
            phoneNumber = username;
            username = username + '@salonhelps.com';
        }

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


    /**
     * 
     * 
     * @param {string} username
     * @param {string} password
     * @returns {Promise<SalonCloudResponse<null>>}
     * 
     * @memberOf FirebaseAuthenticationDatabase
     */
    public async signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<null>> {

        var response: SalonCloudResponse<null> = {
            code: null,
            data: null,
            err: null
        };

        var phoneNumber: string = null;
        var email: string = null;
        var phoneReg = /^\d{10}$/;
        if (username.match(phoneReg)) {
            phoneNumber = username;
            username = username + '@salonhelps.com';
        } else { // username is email
            email = username;
        }
        let promise = new Promise<SalonCloudResponse<null>>(function (resolve, reject) {
            firebase.auth().createUserWithEmailAndPassword(username, password).then(async function (user) {
                response.code = 200;

                var userData: UserData = {
                    username: username,
                    status: true,
                    is_verified: false,
                    is_temporary: false,
                    phone: phoneNumber,
                    email: email
                };
                //Add user data to new user at /users/<user_id>
                var userDatabase = new FirebaseUserManagement(null);
                await userDatabase.addUserData(user.uid, userData);
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

    /**
     * 
     * 
     * @param {string} token
     * @returns {Promise<SalonCloudResponse<null>>}
     * 
     * @memberOf FirebaseAuthenticationDatabase
     */
    public verifyToken(token: string): Promise<SalonCloudResponse<null>> {
        var response: any = {};
        let promise = new Promise(function (resolve, reject) {

            if (!token) {
                response = null;
                resolve(response);
            } else {
                firebaseAdmin.auth().verifyIdToken(token)
                    .then(function (decodedToken) {
                        var uid = decodedToken.uid;
                        response.err = null;
                        response.code = 200;
                        response.data = { _id: uid };
                        resolve(response);
                    }).catch(function (error) {
                        // Handle error
                        response.err = ErrorMessage.InvalidTokenError;
                        response.code = 401;
                        response.data = null;
                        resolve(response);
                    });
            }

        });
        return promise;
    }

    /**
     * Set new password for user.
     * 
     * @param {string} uid
     * @param {string} newPassword
     * @returns {Promise<SalonCloudResponse<null>>}
     * 
     * @memberOf FirebaseAuthenticationDatabase
     */
    public setPassword(uid: string, newPassword: string): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<null> = {
            code: null,
            data: null,
            err: null
        };

        let promise = new Promise(function (resolve, reject) {

            firebaseAdmin.auth().updateUser(uid, {
                password: newPassword
            }).then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully updated user", userRecord.toJSON());
                response.code = 200;
                resolve(response);
            }).catch(function (error) {
                console.log("Error updating user:", error);
                response.code = 500;
                response.err = error;
                resolve(response);
            });
        });
        return promise;
    }

    public createCustomToken(uid: string): Promise<string> {
        let promise = new Promise(function (resolve, reject) {
            firebaseAdmin.auth().createCustomToken(uid)
                .then(function (customToken) {
                    // Send token back to client
                    resolve(customToken);
                })
                .catch(function (error) {
                    console.log("Error creating custom token:", error);
                    resolve(error);
                });
        });
        return promise;
    }

    public signInWithCustomToken(token: string): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: null,
            data: null,
            err: null
        };
        let promise = new Promise<SalonCloudResponse<UserToken>>(function (resolve, reject) {
            firebase.auth().signInWithCustomToken(token)
                .then(function (user) {
                    console.log('user:', user);
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
                    console.log('error:', error);
                    response.code = 400;
                    response.err = error;

                    resolve(response);
                });
        });
        return promise;

    }
}