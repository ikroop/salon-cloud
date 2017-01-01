/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { SalonData, ISalonData } from './../../../Modules/SalonManagement/SalonData'
import SalonModel = require('./SalonModel');

import { SalonManagementDatabaseInterface } from './../SalonManagementDatabaseInterface';

export class MongoSalonManagement implements SalonManagementDatabaseInterface<ISalonData> {

    private salonId: string;


    /**
     * Creates an instance of MongoSalonManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoSalonManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
    }

    /**
     * 
     * 
     * @param {SalonData} salonInfo
     * @returns {Promise<boolean>}
     * 
     * @memberOf MongoSalonManagement
     */
    public async createSalon(salonInfo: SalonData): Promise<ISalonData> {
        // create Salon record
        var rs: ISalonData = undefined;
        var salon = new SalonModel(salonInfo);
        var SalonCreation = salon.save();
        await SalonCreation.then(function (docs) {
            rs = docs;
        }, function (err) {
            throw err;
        })

        return rs;
    }


    /**
     * Get Salon data by Id
     * 
     * @param {string} id
     * @returns {ISalonData}
     * 
     * @memberOf MongoSalonManagement
     */
    public async getSalonById(salonId: string): Promise<ISalonData> {

        var salon: ISalonData = undefined;

        await SalonModel.findOne({ "_id": salonId }).exec(function (err, docs: ISalonData) {
            if (!err) {
                salon = docs;
            } else {
                throw err;
            }
        });

        return salon;
    }
}