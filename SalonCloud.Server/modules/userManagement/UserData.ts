

import {UserProfile} from './UserProfile'

export interface UserData{
    _id: string;
    is_temporary: string;
    is_verified: string;
    password: string;
    profile: [UserProfile];
    status: string;
    username: string;

}