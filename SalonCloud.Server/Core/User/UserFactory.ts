/**
 * 
 * 
 * 
 * 
 */

import { Owner } from './Owner'
import { Manager } from './Manager'
import { Technician } from './Technician'
import { Customer } from './Customer'
import { SalonManagement } from './../../modules/salonManagement/SalonManagement'
import {AdministratorBehavior} from './AdministratorBehavior'

export class UserFactory {
    public static createAdminUserObject(userId: string, salonId: string, role: number) : AdministratorBehavior {
        if(role==1){
            return new Owner(userId, new SalonManagement(salonId));
        }else if(role==2){
            return new Manager(userId, new SalonManagement(salonId));
        }
    }
}