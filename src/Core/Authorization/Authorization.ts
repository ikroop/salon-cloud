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
    public async checkPermission(userId: string, salonId: string, apiName: string): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<string> = {
            code: undefined,
            err: undefined,
            data: undefined
        };

        var roleAPI = RoleConfig.filter(item => item.api.toLowerCase() == apiName.toLowerCase())[0];
        //check userid
        if (!userId) {
            if (roleAPI.role.indexOf('Anonymouse') > -1) {
                response.code = 200;

                response.data = 'Anonymouse';
            } else {
                response.code = 401;

                response.data = undefined;
            }
        } else {
            if (roleAPI.role.indexOf('SignedUser') > -1) {
                response.code = 200;
                response.data = 'SignedUser';
            } else {
                // Validate salon
                // 'salonId' validation
                var salonIdValidation = new BaseValidator(salonId);
                salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
                salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
                var salonIdError = await salonIdValidation.validate();
                if (salonIdError) {
                    response.err = salonIdError.err;
                    response.code = 400;
                    return response;
                }

                // Get User Role
                var user = new UserManagement(salonId);
                var role = await user.getRole(userId);
                if (roleAPI && roleAPI.role.indexOf(role) > -1) {
                    response.data = role;
                    response.code = 200;

                } else {
                    response.code = 403;
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