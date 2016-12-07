/**
 * 
 * 
 * 
 * 
 */

import { UserManagementBehavior } from './UserManagementBehavior'
import { UserData, UserProfile } from './UserData'
// FIX ME: the path have to contain modules/UserManagement
import UserModel = require('./../../Modules/UserManagement/UserModel');
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { IUserData } from './UserData';

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

        var userDocs = UserModel.findOne({ '_id': userId }).exec();

        await userDocs.then(async function (docs) {
            if (docs) {
                var checkExistArray = docs.profile.filter(profile => profile.salon_id === userProfile.salon_id);

                if (checkExistArray.length == 0) {
                    docs.profile.push(userProfile);
                    var saveAction = docs.save();
                    await saveAction.then(function (innerDocs) {
                        returnResult.data = userProfile;
                        returnResult.code = 200;

                    }, function (err) {
                        returnResult.err = err;
                        returnResult.code = 500;
                    });

                } else {
                    returnResult.err = ErrorMessage.ProfileAlreadyExist;
                    returnResult.code = 400;
                }
            } else {
                returnResult.err = ErrorMessage.UserNotFound;
                returnResult.code = 404;

            }
        }, function (err) {
            returnResult.err = err;
            returnResult.code = 500;


        })

        return returnResult;

    }

    /**
     * @method getRole
     * @description Get user role in salon.
     * @param {string} userId
     * @returns {string} role
     * 
     * @memberOf UserManagement
     */
    public async getRole(userId: string): Promise<string> {
        var role: string = undefined;
        console.log('userId:', userId);
        var salonId = this.salonId;
        if (userId) {
            if (salonId) {
                await UserModel.findOne({ "_id": userId }, { "profile": { "$elemMatch": { "salon_id": salonId } } }, ).exec(function (err, docs: IUserData) {
                    console.log('docs:', docs);
                    if (docs && docs.profile && docs.profile.length > 0) {
                        role = this.roleToString(docs.profile[0].role);
                    } else {
                        role = 'SignedUser';
                    }
                });

            }
            else {
                role = 'SignedUser';
            }
        } else {
            role = 'Anonymouse';
        }
        console.log('role:', role);

        return role;
    }

    /**
     * @method roleToString
     * @description convert role (number) to string
     * @private
     * @param {number} role
     * @returns {string} role in string
     * 
     * @memberOf UserManagement
     */
    private roleToString(role: number): string {
        var roleString: string = undefined;
        switch (role) {
            case 0:
                roleString = 'SignedUser';
                break;
            case 1:
                roleString = 'Owner';
                break;
            case 2:
                roleString = 'Manager';
                break;
            case 3:
                roleString = 'Technician';
                break;
            case 4:
                roleString = 'Customer';
                break;
            default:
                roleString = undefined;
                break;
        }

        return roleString;
    }

}
