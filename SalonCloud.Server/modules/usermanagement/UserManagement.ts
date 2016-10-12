/**
 * 
 * 
 * 
 * 
 */

import { UserManagementBehavior } from './UserManagementBehavior'
import { UserData, UserProfile } from './UserData'
var UserModel = require('./UserModel')
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { ErrorMessage } from './../../core/ErrorMessage'

export class UserManagement implements UserManagementBehavior {

    salon_id: string;

    constructor() {
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
