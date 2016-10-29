
import {UserData, UserProfile} from './UserData'


export interface EmployeeManagementBehavior{

    activateEmployee(employeeId : string) : boolean;

    addEmployeeProfile(employeeId: string, profile : any);

    deactivateEmployee(employeeId : string) : boolean;

    getAllEmployee() : Array<UserData>;

    getEmployee(employeeId : string) :UserData;

    updateEmployee(employeeId : string, profile : UserProfile) : boolean;

}