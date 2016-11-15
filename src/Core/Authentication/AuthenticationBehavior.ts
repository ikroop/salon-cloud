/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../SalonCloudResponse';
export interface AuthenticationBehavior {
    changePassword(oldPasswords: string, newPassword: string, code: string);
    sendVerifyCode(username: string);
    signInWithUsernameAndPassword(username: string, password: string);
    signUpWithUsernameAndPassword(username: string, password: string);
    verifyToken(token: string);
}
