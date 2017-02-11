/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import TwilioSecret from './TwilioSecret';
var Twilio = require('twilio');
var TwilioClient = new Twilio.RestClient(TwilioSecret.sid, TwilioSecret.token);

export class SMSService {

    /**
     * 
     * 
     * @static
     * @param {string} phonenumber
     * @param {string} content
     * @returns {string}
     * 
     * @memberOf Twilio
     */
    static sendSMS(phonenumber: string, content: string): Promise<string> {
        var ErrorMessage: string = null;
        let promise = new Promise(function (resolve, reject) {
            TwilioClient.messages.create({
                body: content,
                to: phonenumber,  // Text this number
                from: TwilioSecret.sender // From a valid Twilio number
            }, function (err, message) {
                if (err) {
                    resolve(err.message);
                } else {
                    resolve(message.sid);
                }
            });
        });
        return promise;
    }
}