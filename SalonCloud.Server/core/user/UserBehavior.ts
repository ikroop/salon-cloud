/***
 * 
 * 
 * 
 * 
 */
import {SalonBehavior} from '../salon/SalonBehavior'
import {UserData, UserProfile} from "./UserData";
export interface UserBehavior{
    setSalon(Salon:SalonBehavior);
    createProfile(profileData: UserProfile, callback);
}