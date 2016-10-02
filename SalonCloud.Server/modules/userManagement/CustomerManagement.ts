

import {UserData} from './UserData'
import {UserProfile} from './UserProfile'
import {CustomerManagementBehavior} from './CustomerManagementBehavior'


export class CustomerManagement implements CustomerManagementBehavior{

    addCustomer(phone, profile :UserProfile) : boolean{
        return;
    };

    getAllCustomers() : Array<UserData>{
        return;
    };

    getCustomer(customerId : string) : UserData{
        return;
    };

    updateCustomer(customerId : string, profile :UserProfile) : boolean{
        return;
    };
}