/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { PhoneVerification } from './../Core/Verification/PhoneVerification';

export class SMSRouter {
    private router: Router = Router();

    getRouter(): Router {

        this.router.post('/sendverificationcode', async function (request: Request, response: Response) {
            var phone = request.body.phone;
            var phoneVerification = new PhoneVerification();

            var sendSMSAction = await phoneVerification.sendVerificationCode(phone);
            var returnData;
            if (sendSMSAction.err) {
                returnData = {
                    'err': sendSMSAction.err,
                }
            } else {
                returnData = {
                    'verification_id': sendSMSAction.data,
                }
            }

            response.status(sendSMSAction.code).json(returnData);
        });
        return this.router;
    }
}