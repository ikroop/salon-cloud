/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { UserToken } from './../../Core/Authentication/AuthenticationData';

export interface AuthenticationDatabaseInterface {
    signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<undefined>>;
    signInWithUsernameAndPassword(username: string, password: string):Promise<SalonCloudResponse<UserToken>>;
    verifyToken(token:string);
}