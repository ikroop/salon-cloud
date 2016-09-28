

import {ServiceManagementBehavior} from './ServiceManagementBehavior';
import {ServiceGroup} from './ServiceGroup'

export class ServiceManagement implements ServiceManagementBehavior {

    salonId: string;

    public addGroup(group : ServiceGroup) : string{

    };

    public getServices() : Array<ServiceGroup>{

    };

    public removeGroup(groupId : string) : boolean{

    };

    public updateGroup(groupId : string, group :ServiceGroup) : boolean{

    };

}