/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../SalonCloudResponse';
import { UserToken } from './AuthenticationData';

export interface AuthenticationDatabaseInterface {
    signUpWithUsernameAndPassword(username: string, password: string): Promise<SalonCloudResponse<undefined>>;
    signInWithUsernameAndPassword(username: string, password: string):Promise<SalonCloudResponse<UserToken>>;
    verifyToken(token:string);
}