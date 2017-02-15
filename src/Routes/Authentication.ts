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

         this.router.post('/signinwithcustomtoken', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            //TODO: have to use Anonymouse class
            let result: any = await authentication.signInWithCustomToken(request.body.custom_token);
            response.statusCode = result.code;
            if (result.err) {
                response.json(result.err);
            } else {
                response.json(result.data);
            }
        });
                
        return this.router;

    }
}

