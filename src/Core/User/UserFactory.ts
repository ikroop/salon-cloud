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
import { AdministratorBehavior } from './AdministratorBehavior'
import { RoleDefinition } from '../../Core/Authorization/RoleDefinition'

export class UserFactory {
    public static createAdminUserObject(userId: string, salonId: string, role: string): AdministratorBehavior {
        let admin: AdministratorBehavior = undefined;
        switch (role) {
            case RoleDefinition.Owner.text:
                admin = new Owner(userId, new SalonManagement(salonId));
                break;
            case RoleDefinition.Manager.text:
                admin = new Manager(userId, new SalonManagement(salonId));
                break;
            default:
                admin = undefined;
                break;
        }

        return admin;
    }
}