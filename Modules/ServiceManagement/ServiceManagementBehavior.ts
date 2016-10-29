

import {ServiceGroupData} from './ServiceData'

export interface ServiceManagementBehavior {
    addGroup(group: ServiceGroupData);
    getServices();
    updateGroup(groupId: string, group: ServiceGroupData);
}