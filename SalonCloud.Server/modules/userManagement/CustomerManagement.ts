

import { UserData, UserProfile } from './UserData'
import { CustomerManagementBehavior } from './CustomerManagementBehavior'
import { UserManagement } from './UserManagement'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'


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