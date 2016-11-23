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
        console.log('AddPro: ', userProfile);

        var userDocs = UserModel.findOne({ '_id': userId }).exec();
        console.log('AddPro1: ', userDocs);
        console.log('AddPro111: ', userId);

        await userDocs.then(async function (docs) {
            if (docs) {
                var checkExistArray = docs.profile.filter(profile => profile.salon_id === userProfile.salon_id);
                console.log('AddPro2: ', checkExistArray);

                if (checkExistArray.length == 0) {
                    console.log('AddPro222: ', docs);
                    docs.profile.push(userProfile);
                    console.log('NN: ', docs);
                    var saveAction = docs.save();
                    console.log('AddPro222333: ', docs.profile);
                    await saveAction.then(function (innerDocs) {
                        console.log('AddPro222333444: ', innerDocs);
                        returnResult.data = userProfile;
                        returnResult.code = 200;

                    }, function (err) {
                        returnResult.err = err;
                        returnResult.code = 500;
                    });

                } else {
                    console.log('AddPro223: ', checkExistArray);
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
        /*var checkExistArray = userDocs.profile.filter(profile => profile.salon_id === userProfile.salon_id);
        console.log('AddPro2: ', userProfile);

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
        }*/

    }

    /**
     * @method getRole
     * @description Get user role in salon.
     * @param {string} userId
     * @returns {string} role
     * 
     * @memberOf UserManagement
     */
    public async getRole(userId: string) {
        var role: number = undefined;


        if (userId) {
            if (this.salonId) {
                await UserModel.findOne({ "_id": userId }, { "profile": { "$elemMatch": { "salon_id": this.salonId } } }, ).exec(function (err, docs) {
                    role = docs.profile[0].role;
                });
                return this.roleToString(role);
            }
            else {
                return 'SignedUser';
            }
        } else {
            return 'Anonymouse';
        }

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
