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

export class MongoServiceManagement implements ServiceManagementDatabaseInterface<IServiceGroupData, IServiceItemData> {
    private salonId: string;
    private database: any;
    private serviceRef: any;
    private SERVICE_GROUP_KEY_NAME: string = 'service_groups';
    private readonly SALON_KEY_NAME: string = 'salons';
    /**
        * Creates an instance of MongoServiceManagement.
        * 
        * @param {string} salonId
        * 
        * @memberOf MongoServiceManagement
        */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        this.serviceRef = this.database.ref(this.SERVICE_GROUP_KEY_NAME);
    }

    public async createGroup(group: ServiceGroupData): Promise<IServiceGroupData> {
        /*var rs: IServiceGroupData = undefined;
    
        var serviceGroupModel = new ServiceGroupModel(group);
        var serviceCreation = serviceGroupModel.save();
        await serviceCreation.then(function (docs) {
            rs = docs;
        }, function (err) {
            throw err;
        })
        return rs;
        */


    }

    public async getAllServices(): Promise<IServiceGroupData[]> {
        var rs: IServiceGroupData[] = undefined;
        await ServiceGroupModel.find({ salon_id: this.salonId }).exec(function (err, docs: IServiceGroupData[]) {
            if (err) {
                throw err;
            } else {
                rs = docs;
            }
        });

        return rs;
    }

    public async getServiceItemById(serviceId: string): Promise<IServiceItemData> {
        var rs: IServiceItemData = undefined;
        await ServiceGroupModel.findOne({ 'service_list': { '$elemMatch': { '_id': serviceId } } }).exec(function (err, docs: IServiceItemData) {
            if (err) {
                throw err;
            } else {
                rs = docs;
            }
        });

        return rs;
    }

    public async getServiceGroupByName(groupName: string): Promise<IServiceGroupData> {
        var rs: IServiceGroupData = undefined;
        await ServiceGroupModel.findOne({ 'name': groupName, 'salon_id': this.salonId }).exec(function (err, docs: IServiceGroupData) {
            if (err) {
                throw err;
            } else {
                rs = docs;
            }
        });
        return rs;
    }
}