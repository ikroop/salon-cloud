/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Owner } from './Owner'
import { Manager } from './Manager'
import { Technician } from './Technician'
import { Customer } from './Customer'
import { SalonManagement } from './../../Modules/SalonManagement/SalonManagement'
import {AdministratorBehavior} from './AdministratorBehavior'

export class UserFactory {
    public static createAdminUserObject(userId: string, salonId: string, role: string) : AdministratorBehavior {
        if(role==='Owner'){
            return new Owner(userId, new SalonManagement(salonId));
        }else if(role=='Manager'){
            return new Manager(userId, new SalonManagement(salonId));
        }
    }
}