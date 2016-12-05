/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AuthorizationBehavior } from './AuthorizationBehavior';
import { SalonCloudResponse } from './../SalonCloudResponse';
import { RoleConfig } from './RoleConfig';
import { UserManagement } from './../../Modules/UserManagement/UserManagement';
import { MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidNameString, IsServiceGroupNameExisted }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';
import { BaseValidator } from './../../Core/Validation/BaseValidator';

export class Authorization {

    /**
     * @method checkPermission
     * @description Check user permisstion to access to REST API
     * @param {string} userId
     * @param {string} salonId
     * @param {string} apiName
     * @returns {Promise<SalonCloudResponse<string>>}
     * 
     * @memberOf Authorization
     */
    public async checkPermission(userId: string, salonId: string, apiName: string): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<string> = {
            code: undefined,
            err: undefined,
            data: undefined
        };

        var roleAPI = RoleConfig.filter(item => item.api.toLowerCase() == apiName.toLowerCase())[0];

        if(!roleAPI){
            console.log('Please Add API to file RoleConfig');
            return undefined;
        }
        // Check userId
        if (!userId) {
            // User is Anonymouse
            if (roleAPI.role.indexOf('Anonymouse') > -1) {
                // Api allows to access from Anonymouse
                response.code = 200;
                response.data = 'Anonymouse';
            } else {
                // Unallowed  
                response.code = 401; // Unauthorized
                response.data = undefined;
            }
        } else {
            // userId is exsiting, it means this is SignedUser
            if (roleAPI.role.indexOf('SignedUser') > -1) {
                // Api allow to access from SignedUser
                response.code = 200;
                response.data = 'SignedUser';
            } else {
                // Api ONLY allows to access from Owner, Manager, Techician or Customer
                // Validate salon
                // 'salonId' Validation
                // Role depends on salon.
                var salonIdValidation = new BaseValidator(salonId);
                salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
                salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
                var salonIdError = await salonIdValidation.validate();
                if (salonIdError) {
                    response.err = salonIdError.err;
                    response.code = 400; //Bad Request
                    return response;
                }
                // Get User Role
                var user = new UserManagement(salonId);
                var role = await user.getRole(userId);
                if (roleAPI && roleAPI.role.indexOf(role) > -1) {
                    // Api allows to access from this role
                    response.data = role;
                    response.code = 200; // OK
                } else {
                    // Unallowed
                    response.err = ErrorMessage.NoPermission.err;
                    response.code = 403; // Forbidden
                    response.data = undefined;
                }
            }
        }
        return response;
    }

    //public addPermission(apiFunction: string, id:string, status: boolean): SalonCloudResponse<boolean>;
    //public removePermission(apiFunction: string, id:string): SalonCloudResponse<boolean>;

    public AllowPemission(apiUrl: string, userType: number): SalonCloudResponse<boolean> {
        return;
    };

    public DisAllowPermission(apiUrl: string, UserType): SalonCloudResponse<boolean> {
        return;
    };

    private isExistPermission(apiUrl: string, status: boolean): boolean {
        return;
    };

}