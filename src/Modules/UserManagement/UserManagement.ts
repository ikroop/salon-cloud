/**
 * 
 * 
 * 
 * 
 */

import { UserManagementBehavior } from './UserManagementBehavior'
import { UserData, UserProfile } from './UserData'
// FIX ME: the path have to contain modules/UserManagement
import UserModel = require ('./../../Modules/UserManagement/UserModel');
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'

export class UserManagement implements UserManagementBehavior {

    salonId: string;

    constructor(salonId: string) {
        this.salonId = salonId;
    }

    addUser(phone, profile: UserProfile): boolean {
        return;
    };

    getProfile(employeeId: string): UserData {
        return;
    };

    getUserByRole(role: number): Array<UserData> {
        return;
    };

    updateProfile(employeeId: string, profile: UserProfile): boolean {
        return;
    };

    /**
	* @name: addProfile
    * @parameter: salonId: string, role: number
    * @return: 
    *  - User profile if succeed
    *  - Error if existing or internal error
	*/
    public async addProfile(userId: string, userProfile: UserProfile) {

        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        
        var userDocs = await UserModel.findOne({ '_id': userId }).exec();
        var checkExistArray = userDocs.profile.filter(profile => profile.salon_id === userProfile.salon_id);
        if (checkExistArray.length == 0) {
            userDocs.profile.push(userProfile);
            var saveAction = userDocs.save();
            
            await saveAction.then(function (docs) {
                console.log('docs', docs);
                returnResult.data = userProfile;
                return returnResult;

            }, function (err) {
                returnResult.err = err;
                return returnResult;
            });
            return returnResult;

        } else {
            returnResult.err = ErrorMessage.ProfileAlreadyExist;
            return returnResult;
        }

    }

}
