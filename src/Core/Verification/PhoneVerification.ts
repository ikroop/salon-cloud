/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Twilio } from './../Sms/TwilioSMS'
import { Verification } from './Verification'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { MissingCheck, IsPhoneNumber } from './../../Core/Validation/ValidationDecorators'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { FirebaseVerification } from './../../Services/VerificationDatabase/Firebase/VerificationManagement'

export class PhoneVerification extends Verification {

    /**
     * 
     * 
     * @param {string} phone
     * @returns {Promise<SalonCloudResponse<string>>}: verification_id
     * 
     * @memberOf PhoneVerification
     */
    public async sendVerificationCode(phone: string): Promise<SalonCloudResponse<string>> {

        var returnResult: SalonCloudResponse<string> = {
            code: null,
            data: null,
            err: null
        };

        var code = this.generateCode();

        // phone number validation
        var phoneNumberValidator = new BaseValidator(phone);
        phoneNumberValidator = new MissingCheck(phoneNumberValidator, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidator = new IsPhoneNumber(phoneNumberValidator, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidator.validate();
        if (phoneNumberError) {
            returnResult.err = phoneNumberError;
            returnResult.code = 400;
            return returnResult;
        }
        const CONTENT: string = 'Your SalonHelps verification code is ' + code;

        // generate code in database
        var verificationDatabase: FirebaseVerification = new FirebaseVerification();
        try {
            var verificationObject = await verificationDatabase.generateVerification(phone, code);
            returnResult = await this.sendContent(phone, CONTENT);
            returnResult.data = verificationObject._id;
            returnResult.code = 200;
        } catch (err) {
            returnResult.code = 500;
            returnResult.data = null;
            returnResult.err = err;
        }

        return returnResult;
    }

    /**
     * generate Code with 4 digits
     * 
     * @private
     * @returns {string}
     * 
     * @memberOf PhoneVerification
     */
    private generateCode(): string {
        const LENGTH: number = 4;

        var randomNumber = Math.floor(Math.random() * 10000);
        var code = "" + randomNumber;

        while (code.length < LENGTH) {
            code = "0" + code;
        }
        return code;
    }
}