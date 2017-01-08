/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { ServiceGroupData, ServiceItemData } from './../../Modules/ServiceManagement/ServiceData'


export interface ServiceManagementDatabaseInterface<Group, Service> {
    createGroup(group: ServiceGroupData): Promise<Group>;
    getAllServices(): Promise<Group[]>;
    getServiceItemById(serviceId: string): Promise<Service>;
    getServiceGroupByName(groupName: string): Promise<Group>;
}