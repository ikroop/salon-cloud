/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Twilio } from './../Sms/TwilioSMS'
import { Verification } from './Verification'
import { SalonCloudResponse } from './../SalonCloudResponse'

export class ByPhoneVerification extends Verification {

    public async sendContent(username: string, content: string): Promise<SalonCloudResponse<null>>{
        var response : SalonCloudResponse<any> = {
            code: null,
            err: null,
            data: null
        }
        response.err = await Twilio.sendSMS(username, content);
        return response;
    }
}