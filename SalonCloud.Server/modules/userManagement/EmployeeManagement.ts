
import { UserData, UserProfile } from './UserData'
import { EmployeeManagementBehavior } from './EmployeeManagementBehavior'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { ErrorMessage } from './../../core/ErrorMessage'
import { UserManagement } from './UserManagement';

export class EmployeeManagement extends UserManagement implements EmployeeManagementBehavior {

    activateEmployee(employeeId: string): boolean {
        return;
    };
    public async addEmployeeProfile(employeeId: string, profile: any) : Promise<SalonCloudResponse<UserProfile>> {

        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var newProfile : UserProfile = {
            role : profile.role,
            fullname: profile.fullname,
            salon_id: this.salonId,
            status: true,
            nickname: profile.nickname,
            salary_rate: profile.salary_rate,
            cash_rate: profile.cash_rate,
            social_security_number: profile.social_serurity_number,

        }
        let addProfileAction = await this.addProfile(employeeId, newProfile);
        if(addProfileAction.err){
            returnResult.err = addProfileAction.err;
            returnResult.code = addProfileAction.code;
            return returnResult;
        }else{
            returnResult.code = addProfileAction.code;
            returnResult.data = addProfileAction.data;
            return returnResult;
        }
         


        /*
        var userDocs = await UserModel.findOne({ '_id': this.user_id }).exec();
        var checkExistArray = userDocs.profile.filter(profile => profile.salon_id === salonId);
        if (checkExistArray.length > 0) {
            userDocs.profile.push(newProfile);
            var saveAction = userDocs.save();

            await saveAction.then(function (docs) {
                returnResult.data = newProfile;
                return returnResult;

            }, function (err) {
                returnResult.err = err;
                return returnResult;
            });
            return returnResult;

        } else {
            returnResult.err = ErrorMessage.ProfileAlreadyExist;
            return returnResult;
        }*/

    };

    deactivateEmployee(employeeId: string): boolean {
        return;
    };

    getAllEmployee(): Array<UserData> {
        return;
    };

    getEmployee(employeeId: string): UserData {
        return;
    };

    updateEmployee(employeeId: string, profile: UserProfile): boolean {
        return;
    };

}