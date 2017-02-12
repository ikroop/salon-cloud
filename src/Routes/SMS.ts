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

    public async smsVerification(request: Request, response: Response, next) {
        var phone = request.body.phone;
        var code = request.body.code;
        var verificationId = request.body.verification_id;
        var phoneVerification = new PhoneVerification();
        var result = await phoneVerification.verifyCode(verificationId, phone, code);
        if (result.data) {
            next();
        } else {
            response.status(result.code);
            response.json(result.err);
        }

    }

    getRouter(): Router {

        this.router.post('/sendverificationcode', async function (request: Request, response: Response) {
            var phone = request.body.phone;
            var phoneVerification = new PhoneVerification();

            var sendSMSAction = await phoneVerification.sendVerificationCode(phone);
            var returnData;
            if (sendSMSAction.err) {
                returnData = sendSMSAction.err
            } else {
                returnData = {
                    'verification_id': sendSMSAction.data._id,
                }
            }

            response.status(sendSMSAction.code).json(returnData);
        });
        return this.router;
    }
}