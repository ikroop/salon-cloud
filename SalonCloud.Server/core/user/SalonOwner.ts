//
//
//
//
import {UserData, UserProfile} from './UserData';
import {AdministratorBehavior} from "./AdministratorBehavior";
import {AuthenticatedUserBehavior} from "./AuthenticatedUserBehavior";
import {SalonData} from "./../../modules/salon/SalonData";
import { AuthenticatedUser } from './AuthenticatedUser';

export class SalonOwner extends AuthenticatedUser implements AdministratorBehavior {
    private UserId: string;
    private SalonId: string;
    constructor(SalonId: string, UserId: string) {
        super(UserId);
        
    }

    createProfile(UserInformation: UserProfile, callback) {

    }

    changePassword(OldPassword: string, NewPassword: string, callback){

    }
    createSalon(SalonInformation: SalonData, callback){

    }

}