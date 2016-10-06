

import {UserData} from './UserData'
import {UserProfile} from './UserProfile'

export interface CustomerManagementBehavior{
    addCustomer(phone, profile :UserProfile) : boolean;

    getAllCustomers() : Array<UserData>;

    getCustomer(customerId : string) : UserData;

    updateCustomer(customerId : string, profile :UserProfile) : boolean;

}