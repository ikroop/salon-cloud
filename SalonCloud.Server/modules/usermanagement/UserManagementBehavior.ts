
import {UserData, UserProfile} from './UserData';


export interface UserManagementBehavior{

    salonId: string;

    addUser(phone, profile : UserProfile) : boolean;

    getProfile(employeeId : string) :UserData;

    getUserByRole(role : number) : Array<UserData>;

    updateProfile(employeeId : string, profile : UserProfile) : boolean;

}