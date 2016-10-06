

import {UserManagementBehavior} from './UserManagementBehavior'
import {UserData} from './UserData'
import {UserProfile} from './UserProfile'

export class UserManagement implements UserManagementBehavior{

    salon_id: string;

    addUser(phone, profile : UserProfile) : boolean{
        return;
    };

    getProfile(employeeId : string) : UserData{
        return;
    };

    getUserByRole(role : number) : Array<UserData>{
        return;
    };

    updateProfile(employeeId : string, profile : UserProfile) : boolean{
        return;
    };
    
}
