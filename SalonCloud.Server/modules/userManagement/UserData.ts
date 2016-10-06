

import {UserProfile} from './UserProfile'

export interface UserData{
    is_temporary: string;
    is_verified: string;
    password: string;
    profile: Array<UserProfile>;
    status: string;
    username: string;

}