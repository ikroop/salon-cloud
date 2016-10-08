


import { AbstractAdministrator } from './AbstractAdministrator'
import { UserProfile } from './../../modules/userManagement/UserData'


export class Manager extends AbstractAdministrator {

    protected filterProfileData(user: UserProfile): UserProfile {

        return;
    };
}
