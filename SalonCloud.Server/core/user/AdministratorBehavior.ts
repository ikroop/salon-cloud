/**
 * 
 * 
 * 
 * 
 * 
 */
import {UserProfile} from "./UserData";
import {SalonData} from "../../modules/salon/SalonData";

export interface AdministratorBehavior {
    createProfile(UserInformation: UserProfile, callback);
    //updateProfile(UserInformation: UserProfile, callback);
    //updateSalonProfile(SalonInformation: SalonData, callback);

}