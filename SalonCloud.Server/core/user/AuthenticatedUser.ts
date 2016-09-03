/**
 * 
 * 
 * 
 * 
 */

import { AuthenticatedUserBehavior } from './AuthenticatedUserBehavior';
import { SalonData } from '../../modules/salon/SalonData';
export class AuthenticatedUser implements AuthenticatedUserBehavior {
    constructor(UserId: string) {

    }
    changePassword(OldPassword: string, NewPassword: string, callback) {

    }

    createSalon(SalonInformation: SalonData, callback) {

    }
}