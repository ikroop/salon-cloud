/**
 * 
 * 
 * 
 * 
 */
import TwilioSecret from './TwilioSecret';
var TwilioClient = require('twilio')(TwilioSecret.sid, TwilioSecret.token);

export class Twilio {
    static async sendSMS(phonenumber: string, content: string) {
        var ErrorMessage: string = undefined;

        await TwilioClient.sendSms({
            to: phonenumber,
            from: TwilioSecret.sender,
            body: content
        }, function (error) {
            ErrorMessage = error;
        });
        return ErrorMessage;
    }
}