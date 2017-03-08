/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractAdministrator } from './AbstractAdministrator'
import { UserProfile, IUserData } from './../../Modules/UserManagement/UserData'


export class Manager extends AbstractAdministrator {
    protected filterEmployeeProfileData(employeeList: IUserData[]): IUserData[] {

        
        return employeeList;
    }

}
