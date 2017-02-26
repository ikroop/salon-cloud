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
import { UserProfile } from './../Modules/UserManagement/UserData';
import { AdministratorBehavior } from './../Core/User/AdministratorBehavior';
import { UserFactory } from './../Core/User/UserFactory';

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
            result = await userObject.addEmployee(request.body.phone, userProfile, new ByPhoneVerification());
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

        //get all employees by salon id
        this.router.get('/getall', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            let salonId = request.get("salon_id");
            var admin: AdministratorBehavior;
            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, salonId, request.user.role);
            admin.getAllEmployeeProfile();

            let employeeManagement = new EmployeeManagement(salonId);
            let employees = await employeeManagement.getAllEmployee();
            let dataReturn;
            if (employees.err) {
                dataReturn = employees.err
            } else {
                dataReturn = {
                    'employees': employees.data
                }
            }
            response.status(employees.code);

            response.json(dataReturn);
        });  
        
        return this.router;
    }
}

