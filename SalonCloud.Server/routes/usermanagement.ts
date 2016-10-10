/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
import { AuthorizationRouter } from "./authorization";
import { EmployeeManagement } from '../modules/usermanagement/EmployeeManagement';

export class UserManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
        var employeeManagement = new EmployeeManagement();
       
        this.router.post("/API-NAME", function (request: Request, response: Response) {

        });
       
        this.router.post("/create", function (request: Request, response: Response) {


            var result: SalonCloudResponse<any> = {
                code: undefined,
                data: undefined,
                err: undefined
            };

            employeeManagement.addEmployee(request.body.phone, request.body);

            response.statusCode = result.code;
            if(result.err){
                response.json(result.err);
            }else{
                response.json(result.data);
            }
        });
        return this.router;
    }
}

