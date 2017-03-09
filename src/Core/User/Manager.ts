/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractAdministrator } from './AbstractAdministrator'
import { UserProfile, IUserData } from './../../Modules/UserManagement/UserData'


export class Manager extends AbstractAdministrator {
    protected filterEmployeeProfileData(employeeList: IUserData[]): IUserData[] {

        employeeList.forEach(employee => {
            let employeeProfile = employee.profile[0];
            employeeProfile.address = undefined;
            employeeProfile.birthday = undefined;
            employeeProfile.cash_rate = undefined;
            employeeProfile.salary_rate = undefined;
            employeeProfile.social_security_number = undefined;
        });
        return employeeList;
    }

}
