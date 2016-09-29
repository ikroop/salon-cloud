
import {UserData} from './UserData'
import {UserProfile} from './UserProfile'
import {EmployeeManagementBehavior} from './EmployeeManagementBehavior'

export class EmployeeManagement implements EmployeeManagementBehavior{

    activateEmployee(employeeId : string) : boolean{

    };

    addEmployee(phone, profile : UserProfile) : boolean{

    };

    deactivateEmployee(employeeId : string) : boolean{

    };

    getAllEmployee() : Array<UserData>{

    };

    getEmployee(employeeId : string) :UserData{

    };

    updateEmployee(employeeId : string, profile : UserProfile) : boolean{
        
    };

}