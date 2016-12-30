
import { UserData, UserProfile } from './UserData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'


export interface EmployeeManagementBehavior {

    activateEmployee(employeeId: string): boolean;

    addEmployeeProfile(employeeId: string, profile: any);

    deactivateEmployee(employeeId: string): boolean;

    getAllEmployee(): Promise<SalonCloudResponse<Array<UserData>>>;

    getEmployee(employeeId: string): UserData;

    updateEmployee(employeeId: string, profile: UserProfile): boolean;

}