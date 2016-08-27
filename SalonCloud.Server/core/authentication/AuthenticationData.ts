/**
 * 
 * 
 * 
 * 
 */
import {UserData} from '../../modules/user/UserData';

export interface AuthenticationData {
    username: string,
    password?: string,
    status: boolean,
    is_verified: boolean,
    is_temporary: boolean,
    profile?: [UserData]
}