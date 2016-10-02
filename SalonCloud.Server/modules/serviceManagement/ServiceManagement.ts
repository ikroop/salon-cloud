

import {ServiceManagementBehavior} from './ServiceManagementBehavior';
import {ServiceGroup} from './ServiceGroup'

export class ServiceManagement implements ServiceManagementBehavior {

    salonId: string;

    public addGroup(group : ServiceGroup) : string{
        return;
    };

    public getServices() : Array<ServiceGroup>{
        return;
    };

    public removeGroup(groupId : string) : boolean{
        return;
    };

    public updateGroup(groupId : string, group :ServiceGroup) : boolean{
        return;
    };

}