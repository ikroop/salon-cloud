/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SMSService } from './../Sms/TwilioSMS'
import { Verification } from './Verification'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { MissingCheck, IsPhoneNumber } from './../../Core/Validation/ValidationDecorators'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { FirebaseVerification } from './../../Services/VerificationDatabase/Firebase/VerificationManagement'
import { IVerificationData } from './../../Core/Verification/VerificationData'

export class PhoneVerification extends Verification {

    /**
     * 
     * 
     * @param {string} phone
     * @returns {Promise<SalonCloudResponse<string>>}: verification_id
     * 
     * @memberOf PhoneVerification
     */
    public async sendVerificationCode(phone: string): Promise<SalonCloudResponse<IVerificationData>> {

        var returnResult: SalonCloudResponse<IVerificationData> = {
            code: null,
            data: null,
            err: null
        };

        // generate random code with 4 digits
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
            var smsErrorMessage = await this.sendContent(phone, CONTENT);
            returnResult.data = verificationObject;
            returnResult.code = 200;
        } catch (err) {
            returnResult.code = 500;
            returnResult.data = null;
            returnResult.err = err;
        }

        return returnResult;
    }

    /**
     * 
     * 
     * @param {string} verificationId
     * @param {string} phone
     * @param {string} code
     * @returns {Promise<SalonCloudResponse<boolean>>}
     * 
     * @memberOf PhoneVerification
     */
    public async verifyCode(verificationId: string, phone: string, code: string): Promise<SalonCloudResponse<boolean>> {

        var returnResult: SalonCloudResponse<boolean> = {
            code: null,
            data: null,
            err: null
        };

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

        // generate code in database
        var verificationDatabase: FirebaseVerification = new FirebaseVerification();
        try {
            var verificationObject = await verificationDatabase.getVerification(verificationId, phone, code);

            if (verificationObject) {
                returnResult.data = true;
            } else {
                returnResult.data = false;
            }
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