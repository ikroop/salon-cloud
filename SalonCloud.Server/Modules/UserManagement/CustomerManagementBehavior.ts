

import { UserData, UserProfile } from './UserData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'

export interface CustomerManagementBehavior {
    addCustomerProfile(customerId: string, profile: any): Promise<SalonCloudResponse<UserProfile>>;

    getAllCustomers(): Array<UserData>;

    getCustomer(customerId: string): UserData;

    updateCustomer(customerId: string, profile: UserProfile): boolean;

}