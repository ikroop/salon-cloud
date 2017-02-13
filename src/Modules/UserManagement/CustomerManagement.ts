/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserData, UserProfile } from './UserData';
import { CustomerManagementBehavior } from './CustomerManagementBehavior';
import { UserManagement } from './UserManagement';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { Authentication } from './../../Core/Authentication/Authentication';
import { UserToken } from './../../Core/Authentication/AuthenticationData';
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition';
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsValidNameString, IsValidSalonId }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';
import { FirebaseAuthenticationDatabase } from './../../Services/AuthenticationDatabase/Firebase/FirebaseAuthenticationDatabase';
import { PhoneVerification } from './../../Core/Verification/PhoneVerification';
import { FirebaseVerification } from './../../Services/VerificationDatabase/Firebase/VerificationManagement'

export class CustomerManagement extends UserManagement implements CustomerManagementBehavior {

    /**
     * 
     * 
     * @param {string} customerId
     * @param {UserProfile} profile
     * @returns {Promise<SalonCloudResponse<UserProfile>>}
     * 
     * @memberOf CustomerManagement
     */
    public async addCustomerProfile(customerId: string, profile: UserProfile): Promise<SalonCloudResponse<UserProfile>> {
        var returnResult: SalonCloudResponse<UserProfile> = {
            code: null,
            data: null,
            err: null
        }
        var newProfile: UserProfile = {
            role: RoleDefinition.Customer.value,
            address: profile.address,
            birthday: profile.birthday,
            salon_id: this.salonId,
            salary_rate: 0,
            cash_rate: 0,
            fullname: profile.fullname,
            nickname: profile.nickname,
            social_security_number: null,
            status: true
        }

        var validation = await this.validateCustomerProfile(profile);
        if (validation.err) {
            returnResult.code = validation.code;
            returnResult.err = validation.err;
            return returnResult;
        }
        var addProfileAction = await this.addProfile(customerId, newProfile);
        if (addProfileAction.err) {
            returnResult.err = addProfileAction.err;
            returnResult.code = addProfileAction.code;
            return returnResult;
        } else {
            returnResult.code = addProfileAction.code;
            returnResult.data = addProfileAction.data;
            return returnResult;
        }
    };

    public async createCustomer(phone: string, customerProfile: UserProfile): Promise<SalonCloudResponse<CustomerAuth>> {
        var response: SalonCloudResponse<CustomerAuth> = {
            data: null,
            code: null,
            err: null
        };

        var customerManagementDP = new CustomerManagement(customerProfile.salon_id);
        var authenticationDatabase = new FirebaseAuthenticationDatabase();
        var customer = await customerManagementDP.getUserByPhone(phone);
        if (customer.err) {
            response.err = customer.err;
            response.code = customer.code;
            return response;
        }
        if (!customer.data) {
            // customer account not existed, create account with salon profile for the user                

            // create customer account with phone.
            var authenticationObject = new Authentication();
            var customerSignUpResult = await authenticationObject.signUpWithPhonenumber(phone);
            if (customerSignUpResult.err) {
                response.err = customerSignUpResult.err;
                response.code = customerSignUpResult.code;
                return response;
            }

            // signin customer account
            var customerSigninResult = await authenticationObject.signInWithUsernameAndPassword(phone, customerSignUpResult.data);

            if (customerSigninResult.err) {
                response.err = customerSigninResult.err;
                response.code = customerSigninResult.code;
                return response;
            }

            var customerId = customerSigninResult.data.user._id;
            // add salon profile to customer account
            var profileCreation = await customerManagementDP.addCustomerProfile(customerId, customerProfile);

            if (profileCreation.err) {
                response.err = profileCreation.err;
                response.code = profileCreation.code;
                return response;
            } else {

                var customToken = await authenticationDatabase.createCustomToken(customerId);
                response.data = {
                    uid: customerId,
                    customToken: customToken
                };
                response.code = 200;
                return response;
            }

        } else {
            if (customer.data.profile === null || customer.data.profile.length === 0) {
                //create customer profile for this salon
                var newCustomerProfile = await customerManagementDP.addCustomerProfile(customer.data._id, customerProfile);
                if (newCustomerProfile.err) {
                    response.err = newCustomerProfile.err;
                    response.code = newCustomerProfile.code;
                    return response;
                }
            }

            var customToken = await authenticationDatabase.createCustomToken(customer.data._id);
            response.data = {
                uid: customer.data._id,
                customToken: customToken
            };

            response.code = 200;
            return response;
        }
    }

    public async createCustomerOnline(phone: string, customerProfile: UserProfile, verificationId: string, code: string): Promise<SalonCloudResponse<CustomerAuth>> {
        var response: SalonCloudResponse<CustomerAuth> = {
            data: null,
            code: null,
            err: null
        };
        var phoneVerification = new PhoneVerification();
        var phoneVerificatyionResult = await phoneVerification.verifyCode(verificationId, customerProfile.phone, code);
        if (phoneVerificatyionResult.err) {
            response.err = phoneVerificatyionResult.err;
            response.code = phoneVerificatyionResult.code;
            return response;
        }
        response = await this.createCustomer(phone, customerProfile);

        if (response.code == 200) {
            var verificationDatabase = new FirebaseVerification();
            verificationDatabase.setActivated(verificationId, true);
        }

        return response;
    }

    getAllCustomers(): Array<UserData> {
        return;
    };

    getCustomer(customerId: string): UserData {
        return;
    };

    updateCustomer(customerId: string, profile: UserProfile): boolean {
        return;
    };

    private async validateCustomerProfile(profile: UserProfile): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<null> = {
            code: null,
            err: null,
            data: null
        };

        let fullnameValidation = new BaseValidator(profile.fullname);
        fullnameValidation = new MissingCheck(fullnameValidation, ErrorMessage.MissingCustomerName);
        fullnameValidation = new IsValidNameString(fullnameValidation, ErrorMessage.InvalidNameString);
        let fullnameError = await fullnameValidation.validate();

        if (fullnameError) {
            response.code = 400;
            response.err = fullnameError;
        }

        return response;
    }
}

interface CustomerAuth {
    uid: string,
    customToken: string
}