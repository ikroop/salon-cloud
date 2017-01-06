/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../SalonCloudResponse';
import { ErrorMessage } from './../ErrorMessage';
import { IUserData, UserData, UserProfile } from './../../Modules/UserManagement/UserData'
import jwt = require('jsonwebtoken');
import fs = require('fs');
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsString, IsLengthGreaterThan, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidUserName }
    from './../../Core/Validation/ValidationDecorators';
import { UserToken } from './AuthenticationData';
import { AuthenticationDatabaseInterface } from './../../Services/AuthenticationDatabase/AuthenticationDatabaseInterface';
import { FirebaseAuthenticationDatabase } from './../../Services/AuthenticationDatabase/Firebase/FirebaseAuthenticationDatabase';

export class Authentication {
    private authenticationDatabase: AuthenticationDatabaseInterface;
    constructor() {
        this.authenticationDatabase = new FirebaseAuthenticationDatabase();
    }
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
    public async signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<null> = {
            code: null,
            data: null,
            err: null
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

        response = await this.authenticationDatabase.signUpWithUsernameAndPassword(username, password);
        return response;

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
    public async signInWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<UserToken>> {

        var response: SalonCloudResponse<UserToken> = {
            code: null,
            data: null,
            err: null
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
        response = await this.authenticationDatabase.signInWithUsernameAndPassword(username, password);
        return response;
    }

    /**
     * @method verifyToken
     * @description verify User Token
     * @param {string} token
     * @returns
     *     {null} User Token is null.
     *     {SalonCloudResponse} code 403, error = 'InvalidToken' || code 200, data = { _id: string, username: string, status: boolean }
     * @memberOf Authentication
     */
    public async verifyToken(token: string) {
        var response = await this.authenticationDatabase.verifyToken(token);
        return response;
    }
}
