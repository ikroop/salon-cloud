/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
import { AuthorizationRouter } from "./authorization";
import { EmployeeManagement } from '../modules/usermanagement/EmployeeManagement';
import { SalonManagement } from './../modules/salonManagement/SalonManagement'
import { Owner } from './../core/user/Owner'
import {ByPhoneVerification} from './../core/verification/ByPhoneVerification'

export class UserManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/API-NAME", function (request: Request, response: Response) {

        });

        this.router.post("/create", authorizationRouter.checkPermission , async (request: Request, response: Response) => {


            var result: SalonCloudResponse<any> = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var userObject = new Owner(request.user._id, new SalonManagement(request.body.salon_id));
            
            result = await userObject.addEmployee(request.body.phone, request.body, new ByPhoneVerification());
            let dataReturn;
            if (result.err) {
                dataReturn = {
                    'err': result.err,
                };
            } else {
                dataReturn = {
                    'salon_id': result.data.salon_id,
                    'uid': result.data.uid,
                    'phone': result.data.phone,
                    'fullname': result.data.fullname,
                    'role': result.data.role
                }
            }
            response.status(result.code);

            response.json(dataReturn);
        });
        return this.router;
    }
}

