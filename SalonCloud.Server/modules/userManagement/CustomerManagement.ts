

import { UserData, UserProfile } from './UserData'
import { CustomerManagementBehavior } from './CustomerManagementBehavior'
import { UserManagement } from './UserManagement'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'
import { Authentication} from './../../core/authentication/Authentication'


export class CustomerManagement extends UserManagement implements CustomerManagementBehavior {

    public async addCustomerProfile(customerId: string, profile: any): Promise<SalonCloudResponse<UserProfile>> {
        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        }
        var newProfile : UserProfile = {
            role: 4,
            address: profile.address,
            birthday: profile.birthday,
            salon_id: this.salonId,
            salary_rate: 0,
            cash_rate: 0,
            fullname: profile.customer_name,
            nickname: profile.customer_name,
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

    public async createCustomer(customerData: any): Promise<SalonCloudResponse<UserData>> {
        var response : SalonCloudResponse<UserData> = {
            code: undefined,
            data: undefined,
            err: undefined
        }
        var authDP = new Authentication();

        // create customer account with phone
        var customerAccountCreation = await  authDP.signUpWithAutoGeneratedPassword(customerData.customer_phone);
        if(customerAccountCreation.err){
            response.err = customerAccountCreation.err;
            response.code = customerAccountCreation.code;
            return response;
        }

        // add salon profile to customer account
        var profileCreation = await this.addCustomerProfile(customerAccountCreation.data._id ,customerData);
        if(profileCreation.err){
            response.err = profileCreation.err;
            response.code = profileCreation.code;
            return response;
        }

        response.data = customerAccountCreation.data;
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