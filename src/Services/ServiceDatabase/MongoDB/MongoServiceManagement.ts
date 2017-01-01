/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { ServiceGroupData, ServiceItemData, IServiceGroupData, IServiceItemData } from './../../../Modules/ServiceManagement/ServiceData'
import ServiceGroupModel = require('./ServiceModel');

import { ServiceManagementDatabaseInterface } from './../ServiceManagementDatabaseInterface';

export class MongoServiceManagement implements ServiceManagementDatabaseInterface<IServiceGroupData, IServiceItemData> {
    private salonId: string;

    
    /**
     * Creates an instance of MongoServiceManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoServiceManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
    }

    public async createGroup(group: ServiceGroupData): Promise<IServiceGroupData> {
        var rs: IServiceGroupData = undefined;

        var serviceGroupModel = new ServiceGroupModel(group);
        var serviceCreation = serviceGroupModel.save();
        await serviceCreation.then(function (docs) {
            rs = docs;
        }, function (err) {
            rs = undefined;
        })
        return rs;
    }

    public async getAllServices(): Promise<IServiceGroupData[]> {
        var rs: IServiceGroupData[] = undefined;
        await ServiceGroupModel.find({ salon_id: this.salonId }).exec(function (err, docs: IServiceGroupData[]) {
            if (err) {
                rs = undefined;
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
                rs = undefined
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
                rs = undefined;
            } else {
                rs = docs;
            }
        });
        return rs;
    }
}