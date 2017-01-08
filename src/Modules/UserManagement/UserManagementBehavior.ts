
import {UserData, UserProfile} from './UserData';


export interface UserManagementBehavior{

    addUser(phone, profile : UserProfile) : boolean;

    getProfile(employeeId : string) :UserData;

    getUserByRole(role : number) : Array<UserData>;

    updateProfile(employeeId : string, profile : UserProfile) : boolean;

}