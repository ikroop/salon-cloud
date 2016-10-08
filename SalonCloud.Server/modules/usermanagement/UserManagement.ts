

import {UserManagementBehavior} from './UserManagementBehavior'
import {UserData} from './UserData'
import {UserProfile} from './UserProfile'
import {UserModel} from './UserModel'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'
import {ErrorMessage} from './../../core/ErrorMessage'

export class UserManagement implements UserManagementBehavior{

    user_id: string;
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

    public async addProfile(salonId: string, role: number): SalonCloudResponse<UserProfile> {

        var returnResult : SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var newProfile : UserProfile = {
                role: role,
                salon_id: salonId,
                address: undefined,
                birthday: undefined,
                salary_rate: 6,
                social_security_number: undefined,
                cash_rate: 6,
                fullname: undefined,
                nickname: undefined,
                status: undefined,

        };
        var userDocs = await UserModel.findOne({'_id':this.user_id}).exec();
        var checkExistArray = userDocs.profile.filter(profile=>profile.salon_id === salonId);
        if(checkExistArray.length > 0 ){
            userDocs.profile.push(newProfile);
            var saveAction = userDocs.save();

            await saveAction.then(function(docs){
                returnResult.data = newProfile;
                return returnResult;

            },function(err){
                returnResult.err = err;
                return returnResult;
            });
                return returnResult;

        }else{
            returnResult.err = ErrorMessage.ProfileAlreadyExist;
            return returnResult;
        }

    }
    
}
