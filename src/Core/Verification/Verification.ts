/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Twilio } from './../Sms/TwilioSMS'
import { SalonCloudResponse } from './../SalonCloudResponse'

export abstract class Verification {

     public async sendContent(phone: string, content: string): Promise<SalonCloudResponse<null>>{
        var response : SalonCloudResponse<any> = {
            code: null,
            err: null,
            data: null
        }
        response.err = await Twilio.sendSMS(phone, content);
        return response;
    }

}