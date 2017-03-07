/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { UserToken } from './../../Core/Authentication/AuthenticationData';

export interface AuthenticationDatabaseInterface {
    signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<null>>;
    signInWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<UserToken>>;
    verifyToken(token: string);
    setPassword(uid: string, newPassword: string): Promise<SalonCloudResponse<null>>;
    signInWithCustomToken(token: string): Promise<SalonCloudResponse<UserToken>>;
}