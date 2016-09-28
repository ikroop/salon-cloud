

import {ServiceGroup} from './ServiceGroup'

export interface ServiceManagementBehavior {
    addGroup(group : ServiceGroup) : string;

    getServices() : Array<ServiceGroup>;

    removeGroup(groupId : string) : boolean;

    updateGroup(groupId : string, group :ServiceGroup) : boolean;


}