/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { PhoneVerification } from './../Core/Verification/PhoneVerification';
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

export class SMSRouter {
    private router: Router = Router();

    getRouter(): Router {

        this.router.post('/sendverificationcode', async function (request: Request, response: Response) {
            var phone = request.body.phone;
            var phoneVerification = new PhoneVerification();

            var sendSMSAction = await phoneVerification.sendVerificationCode(phone);
            var restfulResponse = new RestfulResponseAdapter(sendSMSAction);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });
        return this.router;
    }
}