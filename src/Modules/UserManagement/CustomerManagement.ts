

import { UserData, UserProfile } from './UserData';
import { CustomerManagementBehavior } from './CustomerManagementBehavior';
import { UserManagement } from './UserManagement';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { Authentication } from './../../Core/Authentication/Authentication';
import { UserToken } from './../../Core/Authentication/AuthenticationData';
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition';

export class CustomerManagement extends UserManagement implements CustomerManagementBehavior {

    public async addCustomerProfile(customerId: string, profile: UserProfile): Promise<SalonCloudResponse<UserProfile>> {
        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        }
        var newProfile: UserProfile = {
            role: RoleDefinition.Customer,
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

    public async createCustomer(customerPhone: string, customerData: UserProfile): Promise<SalonCloudResponse<UserToken>> {
        var response: SalonCloudResponse<UserToken> = {
            code: undefined,
            data: undefined,
            err: undefined
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
        var profileCreation = await this.addCustomerProfile(signinData.data.user._id, customerData);
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
}