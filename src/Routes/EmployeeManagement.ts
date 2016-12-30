/*
 * GET users listing.
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { EmployeeManagement } from './../Modules/UserManagement/EmployeeManagement';
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement'
import { Owner } from './../Core/User/Owner'
import { ByPhoneVerification } from './../Core/Verification/ByPhoneVerification'

export class EmployeeManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/create', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var result: SalonCloudResponse<any> = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var userObject = new Owner(request.user._id, new SalonManagement(request.body.salon_id));

            result = await userObject.addEmployee(request.body.phone, request.body, new ByPhoneVerification());
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

