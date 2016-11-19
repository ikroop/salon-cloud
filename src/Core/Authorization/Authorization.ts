/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AuthorizationBehavior } from './AuthorizationBehavior';
import { SalonCloudResponse } from './../SalonCloudResponse';
import { RoleConfig } from './RoleConfig';
import { UserManagement } from './../../Modules/UserManagement/UserManagement';

export class Authorization {
    public async checkPermission(userId: string, salonId: string, apiName: string): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<string> = {
            code: undefined,
            err: undefined,
            data: undefined
        };
        // Get User Role
        var user = new UserManagement(salonId);
        var role = await user.getRole(userId);
        console.log('role:', role);
        console.log('api:', apiName.toLowerCase());

        var roleAPI = RoleConfig.filter(item => item.api.toLowerCase() == apiName.toLowerCase())[0];
        console.log('roleAPI:', roleAPI);
        //console.log('roleAPI.role.indexOf(role):', roleAPI.role.indexOf(role));
        if (roleAPI && roleAPI.role.indexOf(role) > -1) {
            response.data = role;
        } else {
            response.data = undefined;
        }
        response.code = 200;
        response.err = undefined;
        console.log('END checkPermission');
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