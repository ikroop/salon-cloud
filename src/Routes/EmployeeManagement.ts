/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */


import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { EmployeeManagement } from './../Modules/UserManagement/EmployeeManagement';
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement'
import { Owner } from './../Core/User/Owner'
import { PhoneVerification } from './../Core/Verification/PhoneVerification'
import { UserProfile } from './../Modules/UserManagement/UserData';

export class EmployeeManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/create', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var result: SalonCloudResponse<any> = {
                code: null,
                data: null,
                err: null
            };
            var userObject = new Owner(request.user._id, new SalonManagement(request.body.salon_id));

            var userProfile: UserProfile = {
                fullname: request.body.fullname || null,
                role: request.body.role,
                salon_id: request.body.salon_id || null,
                salary_rate: request.body.salary_rate || null,
                cash_rate: request.body.cash_rate || null,
                social_security_number: request.body.social_security_number || null,
                nickname: request.body.nickname || null,
                phone: request.body.phone || null
            }
            result = await userObject.addEmployee(request.body.phone, userProfile, new PhoneVerification());
            let dataReturn;
            if (result.err) {
                dataReturn = result.err
            } else {
                dataReturn = {
                    '_id': result.data.uid
                }
            }
            response.status(result.code);

            response.json(dataReturn);
        });
        return this.router;
    }
}

