/**
 * 
 * 
 * 
 */
import {SalonData} from "../../modules/salon/SalonData";

export interface AuthenticatedUserBehavior {
    changePassword(OldPassword: string, NewPassword: string, callback);
    createSalon(SalonInformation: SalonData, callback); 
}