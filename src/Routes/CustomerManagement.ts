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
import { CustomerManagement } from './../Modules/UserManagement/CustomerManagement';
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement'
import { Owner } from './../Core/User/Owner'
import { PhoneVerification } from './../Core/Verification/PhoneVerification'
import { UserProfile } from './../Modules/UserManagement/UserData';

export class CustomerManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/create', async (request: Request, response: Response) => {

            var customerManagement = new CustomerManagement(request.body.salon_id);

            var userProfile: UserProfile = {
                fullname: request.body.fullname || null,
                role: request.body.role,
                salon_id: request.body.salon_id || null,
                salary_rate: request.body.salary_rate || null,
                cash_rate: request.body.cash_rate || null,
                social_security_number: request.body.social_security_number || null,
                nickname: request.body.nickname || null,
                phone: request.body.phone || null,
                address: request.body.address || null,
                birthday: request.body.birthday || null
            }

            var code = request.body.code;
            var verificationId = request.body.verification_id

            var result = await customerManagement.createCustomerOnline(request.body.phone, userProfile, verificationId, code);
            let dataReturn;
            if (result.err) {
                dataReturn = result.err
            } else {
                dataReturn = {
                    'customToken': result.data.customToken
                }
            }
            response.status(result.code);
            response.json(dataReturn);
        });
        return this.router;
    }
}

