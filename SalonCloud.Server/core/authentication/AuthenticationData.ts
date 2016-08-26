/**
 * 
 * 
 * 
 * 
 */
import {UserProfile} from '../../modules/user/UserProfile';

export interface AuthenticationData {
    username: string,
    password?: string,
    status: boolean,
    is_verified: boolean,
    is_temporary: boolean,
    profile?: [UserProfile]
}