/**
 * 
 * 
 * 
 * 
 */

import { SalonCloudResponse } from "./../SalonCloudResponse";
import { AuthorizationData } from "./AuthorizationData";
export interface AuthorizationBehavior {
    changePassword(oldPasswords: string, newPassword: string, code: string, callback);
    sendVerifyCode(username: string, callback);
    signInWithUsernameAndPassword(username: string, password: string, callback);
    signUpWithUsernameAndPassword(username: string, password: string, callback);
    verifyToken(token: string, callback);
}