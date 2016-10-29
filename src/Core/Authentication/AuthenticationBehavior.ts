/**
 * 
 * 
 * 
 * 
 */

import { SalonCloudResponse } from './../SalonCloudResponse';
export interface AuthenticationBehavior {
    changePassword(oldPasswords: string, newPassword: string, code: string, callback);
    sendVerifyCode(username: string, callback);
    signInWithUsernameAndPassword(username: string, password: string, callback);
    signUpWithUsernameAndPassword(username: string, password: string, callback);
    verifyToken(token: string, callback);
}