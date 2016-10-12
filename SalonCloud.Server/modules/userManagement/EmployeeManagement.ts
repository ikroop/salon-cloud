
import {UserData, UserProfile} from './UserData'
import {EmployeeManagementBehavior} from './EmployeeManagementBehavior'
var UserModel = require('./UserModel')
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { ErrorMessage } from './../../core/ErrorMessage'
import { UserManagement} from './UserManagement';

export class EmployeeManagement extends UserManagement implements EmployeeManagementBehavior{

    activateEmployee(employeeId : string) : boolean{
        return;
    };
    // can phai bo di;
    addEmployeeProfile(employeeId: string , profile : UserProfile) : boolean{

        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };


         
        returnResult.data = profile;
        returnResult.err = 200;
        return true;//returnResult;


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