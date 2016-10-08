
import {UserData, UserProfile} from './UserData'
import {EmployeeManagementBehavior} from './EmployeeManagementBehavior'

export class EmployeeManagement implements EmployeeManagementBehavior{

    activateEmployee(employeeId : string) : boolean{
        return;
    };

    addEmployee(phone, profile : UserProfile) : boolean{
        return;
    };

    deactivateEmployee(employeeId : string) : boolean{
        return;
    };

    getAllEmployee() : Array<UserData>{
        return;
    };

    getEmployee(employeeId : string) :UserData{
        return;
    };

    updateEmployee(employeeId : string, profile : UserProfile) : boolean{
        return;
    };

}