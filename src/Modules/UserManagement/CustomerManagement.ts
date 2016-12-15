

import { UserData, UserProfile } from './UserData';
import { CustomerManagementBehavior } from './CustomerManagementBehavior';
import { UserManagement } from './UserManagement';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { Authentication } from './../../Core/Authentication/Authentication';
import { UserToken } from './../../Core/Authentication/AuthenticationData';
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition';
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsValidNameString }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';

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
            code: undefined,
            data: undefined,
            err: undefined
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
            social_security_number: undefined,
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

    /**
     * 
     * 
     * @param {string} customerPhone
     * @param {UserProfile} customerData
     * @returns {Promise<SalonCloudResponse<UserToken>>}
     * 
     * @memberOf CustomerManagement
     */
    public async createCustomer(customerPhone: string, customerProfile: UserProfile): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: undefined,
            data: undefined,
            err: undefined
        }

        var validation = await this.validateCustomerProfile(customerProfile);
        if (validation.err) {
            response.code = validation.code;
            response.err = validation.err;
            return response;
        }

        // create customer account with phone

        var authObject = new Authentication();
        var randomPassword = 100000 + Math.floor(Math.random() * 900000);
        var randomPasswordString = randomPassword.toString();

        var signUpData = await authObject.signUpWithUsernameAndPassword(customerPhone, randomPasswordString);

        if (signUpData.err) {
            response.err = signUpData.err;
            response.code = signUpData.code;
            return response;
        }

        //Signin new customer
        let signinData: SalonCloudResponse<UserToken> = await authObject.signInWithUsernameAndPassword(customerPhone, randomPasswordString);

        // add salon profile to customer account
        var profileCreation = await this.addCustomerProfile(signinData.data.user._id, customerProfile);
        if (profileCreation.err) {
            response.err = profileCreation.err;
            response.code = profileCreation.code;
            return response;
        }

        response.data = signinData.data;
        response.code = 200;
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

    private async validateCustomerProfile(profile: UserProfile): Promise<SalonCloudResponse<undefined>> {
        var response: SalonCloudResponse<undefined> = {
            code: undefined,
            err: undefined,
            data: undefined
        };

        let fullnameValidation = new BaseValidator(profile.fullname);
        fullnameValidation = new MissingCheck(fullnameValidation, ErrorMessage.MissingCustomerName);
        fullnameValidation = new IsValidNameString(fullnameValidation, ErrorMessage.MissingCustomerName);
        let fullnameError = await fullnameValidation.validate();

        if (fullnameError) {
            response.code = 400;
            response.err = fullnameError;
        }

        return response;
    }
}