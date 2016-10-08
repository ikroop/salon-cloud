

import {UserData, UserProfile} from './UserData'

export interface CustomerManagementBehavior{
    addCustomer(phone, profile :UserProfile) : boolean;

    getAllCustomers() : Array<UserData>;

    getCustomer(customerId : string) : UserData;

    updateCustomer(customerId : string, profile :UserProfile) : boolean;

}