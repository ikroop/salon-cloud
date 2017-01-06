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
        var serviceGroup: IServiceGroupData = undefined;
        var newGroup = await this.serviceRef.push();
        await newGroup.save(group);
        serviceGroup = await this.getServiceGroupById(newGroup.key);
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
        var rs: IServiceGroupData[] = undefined;
        await this.serviceRef.orderByChild('group_name').once('value', async function (snapshot) {
            var serviceGroup: IServiceGroupData = snapshot.val();
            if (serviceGroup) {
                serviceGroup._id = snapshot.key;
                rs.push(serviceGroup);
            }
        });
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
        var rs: IServiceItemData = undefined;
        await this.serviceRef.orderByChild('service_list/' + serviceId).once('value', async function (snapshot) {
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
     * @param {string} groupName
     * @returns {Promise<IServiceGroupData>}
     * 
     * @memberOf FirebaseServiceManagement
     */
    public async getServiceGroupByName(groupName: string): Promise<IServiceGroupData> {
        var rs: IServiceGroupData = undefined;
        await this.serviceRef.orderByChild('group_name').equalTo(groupName).once('value', async function (snapshot) {
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
        var serviceGroup: IServiceGroupData = undefined;
        await this.serviceRef.child(id).once('value', async function (snapshot) {
            serviceGroup = snapshot.val();
            if (serviceGroup) {
                serviceGroup._id = snapshot.key;
            }
        });

        return serviceGroup;
    }
}