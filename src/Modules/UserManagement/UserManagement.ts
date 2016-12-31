/**
 * 
 * 
 * 
 * 
 */

import { UserManagementBehavior } from './UserManagementBehavior'
import { UserData, UserProfile, IUserData } from './UserData'
// FIX ME: the path have to contain modules/UserManagement
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition';
import { UserManagementDatabaseInterface } from './../../Services/UserDatabase/UserManagementDatabaseInterface';
import { MongoUserManagement } from './../../Services/UserDatabase/MongoDB/MongoUserManagement';

export class UserManagement implements UserManagementBehavior {

    protected salonId: string;
    protected userDatabase: UserManagementDatabaseInterface<IUserData>;
    constructor(salonId: string) {
        this.salonId = salonId;
        this.userDatabase = new MongoUserManagement<IUserData>();
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
        var role: string = undefined;
        var rolevalue: number = undefined;
        var salonId = this.salonId;
        if (userId) {
            if (salonId) {
                var user = await this.userDatabase.getUserById(userId, this.salonId);
                if (user && user.profile && user.profile.length > 0) {
                    rolevalue = user.profile[0].role;
                } else {
                    rolevalue = undefined;
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
    public async getUserByPhone(phone: string): Promise<IUserData> {
        var user: IUserData = undefined;
        user = await this.userDatabase.getUserByPhone(phone, this.salonId)
        return user;
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
        var user: IUserData = undefined;
        user = await this.userDatabase.getUserById(Id, this.salonId);
        return user;
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
        for (var roleDef in RoleDefinition) {
            if (RoleDefinition[roleDef].value === role) {
                roleString = roleDef;
                break;
            }
        }

        return roleString;
    }

}
