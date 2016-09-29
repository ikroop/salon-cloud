

import {UserData} from './UserData'
import {UserProfile} from './UserProfile'
import {CustomerManagementBehavior} from './CustomerManagementBehavior'


export class CustomerManagement implements CustomerManagementBehavior{

    addCustomer(phone, profile :UserProfile) : boolean{};

    getAllCustomers() : Array<UserData>{};

    getCustomer(customerId : string) : UserData{};

    updateCustomer(customerId : string, profile :UserProfile) : boolean{};
}