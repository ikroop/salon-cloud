/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractAdministrator } from './AbstractAdministrator'
import { UserProfile } from './../../Modules/UserManagement/UserData'


export class Manager extends AbstractAdministrator {

    protected filterProfileData(user: UserProfile): UserProfile {

        return;
    };
}
