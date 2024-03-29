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
import { MissingCheck, IsString, IsLengthGreaterThan, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidUserName, IsPhoneNumber }
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
        usernameValidator = new MissingCheck(usernameValidator, ErrorMessage.MissingUsername.err);
        usernameValidator = new IsValidUserName(usernameValidator, ErrorMessage.NotEmailOrPhoneNumber.err);
        var usernameResult = await usernameValidator.validate();
        if (usernameResult) {
            response.err = usernameResult;
            response.code = 400;
            return response;
        }

        // Validate password;
        var passwordValidator = new BaseValidator(password);
        passwordValidator = new MissingCheck(passwordValidator, ErrorMessage.MissingPassword.err);
        passwordValidator = new IsLengthGreaterThan(passwordValidator, ErrorMessage.PasswordTooShort.err, 6);
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
        usernameValidator = new MissingCheck(usernameValidator, ErrorMessage.MissingUsername.err);
        var usernameResult = await usernameValidator.validate();
        if (usernameResult) {
            response.err = usernameResult;
            response.code = 400;
            return response;
        }

        // Validate password;
        var passwordValidator = new BaseValidator(password);
        passwordValidator = new MissingCheck(passwordValidator, ErrorMessage.MissingPassword.err);
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

    /**
     * Sign Up new account with phone. ONLY use for customer & employee.
     * 
     * @param {string} phone
     * @returns {Promise<SalonCloudResponse<string>>}
     * 
     * @memberOf Authentication
     */
    public async signUpWithPhonenumber(phone: string): Promise<SalonCloudResponse<string>> {

        var response: SalonCloudResponse<string> = {
            code: null,
            data: null,
            err: null
        };

        // validate phonenumber
        var phoneNumberValidator = new BaseValidator(phone);
        phoneNumberValidator = new MissingCheck(phoneNumberValidator, ErrorMessage.MissingPhoneNumber.err);
        phoneNumberValidator = new IsPhoneNumber(phoneNumberValidator, ErrorMessage.WrongPhoneNumberFormat.err);
        var phoneNumberError = await phoneNumberValidator.validate();
        if (phoneNumberError) {
            response.err = phoneNumberError;
            response.code = 400;
            return response;
        }

        // create customer account with phone

        var randomPassword = 100000 + Math.floor(Math.random() * 900000);
        var randomPasswordString = randomPassword.toString();

        var signUpData = await this.signUpWithUsernameAndPassword(phone, randomPasswordString);

        if (signUpData.err) {
            response.err = signUpData.err;
            response.code = signUpData.code;
        } else {
            response.code = 200;
            response.data = randomPasswordString;
        }
        return response;
    }

    /**
     * Set new password for user. ONLY use Customer & Employee.
     * 
     * @param {string} uid
     * @param {string} newPassword
     * @returns {Promise<SalonCloudResponse<null>>}
     * 
     * @memberOf Authentication
     */
    public async setPassword(uid: string, newPassword: string): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<null> = {
            code: null,
            data: null,
            err: null
        };

        response = await this.authenticationDatabase.setPassword(uid, newPassword);
        return response;
    }

    /**
     * Signin with custom token
     * 
     * @param {string} customeToken
     * @returns {Promise<SalonCloudResponse<UserToken>>}
     * 
     * @memberOf Authentication
     */
    public async signInWithCustomToken(customeToken: string): Promise<SalonCloudResponse<UserToken>> {

        var response: SalonCloudResponse<UserToken> = {
            code: null,
            data: null,
            err: null
        };

        // Validate Username
        var customTokenValidator = new BaseValidator(customeToken);
        customTokenValidator = new MissingCheck(customTokenValidator, ErrorMessage.MissingCustomToken.err);
        var customTokenValidationResult = await customTokenValidator.validate();
        if (customTokenValidationResult) {
            response.err = customTokenValidationResult;
            response.code = 400;
            return response;
        }

        response = await this.authenticationDatabase.signInWithCustomToken(customeToken);
        return response;
    }
}
