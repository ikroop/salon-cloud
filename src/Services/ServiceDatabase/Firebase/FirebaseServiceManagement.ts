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
    private SERVICE_GROUP_KEY_NAME: string = 'service_groups';
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
        this.serviceRef = salonRef.ref(salonId + '/' + this.SERVICE_GROUP_KEY_NAME);
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
        var serviceGroup: IServiceGroupData = undefined;
        var newGroup = await this.serviceRef.push();
        await newGroup.save(group);
        serviceGroup = await this.getServiceGroupById(newGroup.key);
        return serviceGroup;
    }

    public async getAllServices(): Promise<IServiceGroupData[]> {
        var rs: IServiceGroupData[] = undefined;

        return rs;
    }

    public async getServiceItemById(serviceId: string): Promise<IServiceItemData> {
        return;
    }

    public async getServiceGroupByName(groupName: string): Promise<IServiceGroupData> {
        return;
    }

    private async getServiceGroupById(id: string): Promise<IServiceGroupData> {
        var serviceGroup: IServiceGroupData = undefined;
        await this.serviceRef.ref(id).once('value', async function (snapshot) {
            serviceGroup = snapshot.val();
            if (serviceGroup) {
                serviceGroup._id = snapshot.key;
            }
        });

        return serviceGroup;
    }
}