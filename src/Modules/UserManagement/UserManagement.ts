/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserManagementBehavior } from './UserManagementBehavior'
import { UserData, UserProfile, IUserData } from './UserData'
// FIX ME: the path have to contain modules/UserManagement
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition';
import { UserManagementDatabaseInterface } from './../../Services/UserDatabase/UserManagementDatabaseInterface';
import { FirebaseUserManagement } from './../../Services/UserDatabase/Firebase/FirebaseUserManagement';
import { MissingCheck, IsPhoneNumber, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidSalonTimeData, IsSalonTime, IsAfterSecondDate }
    from './../../Core/Validation/ValidationDecorators';
import { BaseValidator } from './../../Core/Validation/BaseValidator';

export class UserManagement implements UserManagementBehavior {

    protected salonId: string;
    protected userDatabase: UserManagementDatabaseInterface<IUserData>;
    constructor(salonId: string) {
        this.salonId = salonId;
        this.userDatabase = new FirebaseUserManagement(this.salonId);
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
        var returnResult: SalonCloudResponse<UserProfile> = await this.userDatabase.createProfile(userId, userProfile);
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
        var role: string = null;
        var rolevalue: number = null;
        var salonId = this.salonId;
        if (userId) {
            if (salonId) {
                var user = await this.userDatabase.getUserById(userId);
                if (user && user.profile && user.profile.length > 0) {
                    rolevalue = user.profile[0].role;
                } else {
                    rolevalue = null;
                }

                // check role value
                if (rolevalue) {
                    role = this.roleToString(rolevalue);
                } else {
                    role = 'SignedUser';
                }

            }
            else {
                role = 'SignedUser';
            }
        } else {
            role = 'Anonymouse';
        }
        return role;
    }

    /**
     * 
     * 
     * @param {string} phone
     * @returns {Promise<IUserData>}
     * 
     * @memberOf UserManagement
     */
    public async getUserByPhone(phone: string): Promise<SalonCloudResponse<IUserData>> {
        var response: SalonCloudResponse<any> = {
            code: null,
            err: null,
            data: null
        };
        try {
            var salonIdValidation = new BaseValidator(this.salonId);
            salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
            var salonIdError = await salonIdValidation.validate();
            if(salonIdError){
                response.err = salonIdError;
                response.code = 400;
                return response;
            }
            var user: IUserData = null;
            user = await this.userDatabase.getUserByPhone(phone)
            response.code = 200;
            response.data = user;
        } catch (error) {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        return response;
    }

    /**
     * 
     * 
     * @param {string} Id
     * @returns {Promise<IUserData>}
     * 
     * @memberOf UserManagement
     */
    public async getUserById(Id: string): Promise<IUserData> {
        var user: IUserData = null;
        try {
            user = await this.userDatabase.getUserById(Id);
            return user;
        } catch (error) {
            throw error;
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
        var roleString: string = null;
        for (var roleDef in RoleDefinition) {
            if (RoleDefinition[roleDef].value === role) {
                roleString = roleDef;
                break;
            }
        }

        return roleString;
    }

}
