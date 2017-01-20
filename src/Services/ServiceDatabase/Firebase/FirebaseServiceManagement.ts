/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { ServiceGroupData, ServiceItemData, IServiceGroupData, IServiceItemData } from './../../../Modules/ServiceManagement/ServiceData'

import { ServiceManagementDatabaseInterface } from './../ServiceManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

export class FirebaseServiceManagement implements ServiceManagementDatabaseInterface<IServiceGroupData, IServiceItemData> {
    private salonId: string;
    private database: any;
    private serviceRef: any;
    private readonly SERVICE_GROUP_KEY_NAME: string = 'service_groups';

    /**
     * Creates an instance of FirebaseServiceManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf FirebaseServiceManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        var salonDatabase = new FirebaseSalonManagement(salonId);
        var salonRef = salonDatabase.getSalonFirebaseRef();
        this.serviceRef = salonRef.child(salonId + '/' + this.SERVICE_GROUP_KEY_NAME);
    }

    /**
     * 
     * 
     * @param {ServiceGroupData} group
     * @returns {Promise<IServiceGroupData>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    public async createGroup(group: ServiceGroupData): Promise<IServiceGroupData> {
        var serviceGroup: IServiceGroupData = null;

        //ready for creating service item id
        var serviceList = group.service_list;

        //clear service List
        group.service_list = null;

        var newGroup = await this.serviceRef.push();
        await newGroup.set(group);
        serviceGroup = await this.getServiceGroupById(newGroup.key);

        //push service item;
        serviceList.forEach(async item => {
            await newGroup.child('service_list').push().set(item);
        });
        return serviceGroup;
    }

    /**
     * 
     * 
     * @returns {Promise<IServiceGroupData[]>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    public async getAllServices(): Promise<IServiceGroupData[]> {
        var rs: IServiceGroupData[] = [];
        var allServiceGroups = null;
        await this.serviceRef.orderByChild('name').once('value', function (snapshot) {
            allServiceGroups = snapshot.val();
        });
        if (allServiceGroups) {
            for (var key in allServiceGroups) {
                var serviceGroup: IServiceGroupData = allServiceGroups[key];
                serviceGroup._id = key;
                var serviceList: IServiceItemData[] = [];
                for (var serviceListKey in serviceGroup.service_list) {
                    var serviceItem: IServiceItemData = serviceGroup.service_list[serviceListKey];
                    serviceItem._id = serviceListKey;
                    serviceList.push(serviceItem);
                }
                serviceGroup.service_list = serviceList;
                rs.push(serviceGroup);
            }
        }
        return rs;
    }

    /**
     * 
     * 
     * @param {string} serviceId
     * @returns {Promise<IServiceItemData>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    public async getServiceItemById(serviceId: string): Promise<IServiceItemData> {
        var rs: IServiceItemData = null;
        var serviceGroupList: IServiceGroupData[] = null;
        try {
            await this.serviceRef.orderByChild('name').once('value', function (snapshot) {
                serviceGroupList = snapshot.val();
            });

            if (serviceGroupList && serviceId) {
                for (var servicegroupId in serviceGroupList) {
                    var serviceList = serviceGroupList[servicegroupId].service_list;
                    if (serviceList[serviceId]) {
                        rs = serviceList[serviceId];
                        rs._id = serviceId;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
        return rs;
    }

    /**
     * 
     * 
     * @param {string} groupName
     * @returns {Promise<IServiceGroupData>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    public async getServiceGroupByName(groupName: string): Promise<IServiceGroupData> {
        var rs: IServiceGroupData = null;
        await this.serviceRef.orderByChild('name').equalTo(groupName).once('value', async function (snapshot) {
            rs = snapshot.val();
            if (rs) {
                rs._id = snapshot.key;
            }
        });
        return rs;
    }

    /**
     * 
     * 
     * @private
     * @param {string} id
     * @returns {Promise<IServiceGroupData>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    private async getServiceGroupById(id: string): Promise<IServiceGroupData> {
        var serviceGroup: IServiceGroupData = null;
        await this.serviceRef.child(id).once('value', async function (snapshot) {
            serviceGroup = snapshot.val();
            if (serviceGroup) {
                serviceGroup._id = snapshot.key;
            }
        });

        return serviceGroup;
    }
}