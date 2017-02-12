/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import jwt = require('jsonwebtoken');
import { Router, Request, Response } from 'express';
import { AuthorizationRouter } from './Authorization';
import { Authentication } from './../Core/Authentication/Authentication';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { SMSRouter } from './SMS';
import { CustomerManagement } from './../Modules/UserManagement/CustomerManagement'

export class AuthenticationRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
        var smsRouter = new SMSRouter();
        this.router.post('/signupwithusernameandpassword', authorizationRouter.checkPermission, async (request: Request, response: Response) => {
            //TODO: have to use Anonymouse class
            let result = await authentication.signUpWithUsernameAndPassword(request.body.username, request.body.password);
            response.statusCode = result.code;
            if (result.err) {
                response.json(result.err);
            } else {
                response.json(result.data);
            }
        });

        this.router.post('/signinwithusernameandpassword', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            //TODO: have to use Anonymouse class
            let result: any = await authentication.signInWithUsernameAndPassword(request.body.username, request.body.password);
            response.statusCode = result.code;
            if (result.err) {
                response.json(result.err);
            } else {
                response.json(result.data);
            }
        });

        this.router.post('/customersigup', smsRouter.smsVerification, async function (request: Request, response: Response) {

            var phone = request.body.phone;
            var code = request.body.code;
            var verificationId = request.body.verification_id;
            var salonId = request.body.salon_id;

            var customerManagementDP = new CustomerManagement(salonId);

            var customer = await customerManagementDP.getUserByPhone(phone);
            if (customer.err) {
                response.statusCode = customer.code;
                response.json(customer.err);
            }

            if (!customer.data) {
                var customerSignUpResult = await authentication.signUpWithPhonenumber(phone);
                response.statusCode = customerSignUpResult.code;
                if (customerSignUpResult.err) {
                    response.json(customerSignUpResult.err);
                } else {
                    var password = customerSignUpResult.data;
                    response.json({
                        'phone': phone,
                        'password': password
                    });
                }
            } else {
                var customerId = customer.data._id;
                var randomPassword = 100000 + Math.floor(Math.random() * 900000);
                var randomPasswordString = randomPassword.toString();

                var setPasswordResult = await authentication.setPassword(customerId, randomPasswordString);
                response.statusCode = setPasswordResult.code;
                if (setPasswordResult.err) {
                    response.json(setPasswordResult.err);
                } else {
                    response.json({
                        'phone': phone,
                        'password': randomPasswordString
                    });
                }
            }

        });

        return this.router;

    }
}

