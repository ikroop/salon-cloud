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
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

export class AuthenticationRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
        var smsRouter = new SMSRouter();
        this.router.post('/signupwithusernameandpassword', authorizationRouter.checkPermission, async (request: Request, response: Response) => {
            //TODO: have to use Anonymouse class
            let result = await authentication.signUpWithUsernameAndPassword(request.body.username, request.body.password);

            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        this.router.post('/signinwithusernameandpassword', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            //TODO: have to use Anonymouse class
            let result: any = await authentication.signInWithUsernameAndPassword(request.body.username, request.body.password);
            
            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

         this.router.post('/signinwithcustomtoken', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            //TODO: have to use Anonymouse class
            let result: any = await authentication.signInWithCustomToken(request.body.custom_token);
            
            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });
                
        return this.router;

    }
}

