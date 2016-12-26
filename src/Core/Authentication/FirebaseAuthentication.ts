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

export class FirebaseAuthentication implements AuthenticationBehavior {

    public async changePassword(oldPasswords: string, newPassword: string, code: string) {

    }

    public async sendVerifyCode(username: string) {

    }

    public async signInWithUsernameAndPassword(username: string, password: string) {

    }

    public async signUpWithUsernameAndPassword(username: string, password: string) {

    }
    
    public async verifyToken(token: string) {

    }
}