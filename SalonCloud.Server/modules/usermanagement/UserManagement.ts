

import {UserManagementBehavior} from './UserManagementBehavior'
import {UserData} from './UserData'
import {UserProfile} from './UserProfile'
import {UserModel} from './UserModel'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'

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
        var userDocs = await UserModel.findOne({}).exec();
        
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
    }
    
}
