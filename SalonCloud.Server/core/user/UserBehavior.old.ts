/***
 * 
 * 
 * 
 * 
 */
import {UserData, UserProfile} from "./UserData";
export interface UserBehavior{
    createProfile(profileData: UserProfile, callback);
}