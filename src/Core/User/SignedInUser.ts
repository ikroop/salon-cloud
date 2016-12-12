/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SignedInUserBehavior } from './SignedInUserBehavior'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { SalonManagement } from './../../Modules/SalonManagement/SalonManagement'
import { SalonInformation } from './../../Modules/SalonManagement/SalonData'
import { SalonSchedule } from './../../Modules/Schedule/SalonSchedule'
import { Schedule } from './../../Modules/Schedule/Schedule'
import { defaultWeeklySchedule } from './../DefaultData'
import { UserManagement } from './../../Modules/UserManagement/UserManagement'
import { UserProfile } from './../../Modules/UserManagement/UserData'
import { ServiceManagement } from './../../Modules/ServiceManagement/ServiceManagement'
import { ServiceGroupData } from './../../Modules/ServiceManagement/ServiceData'
import { samplesService1, samplesService2 } from './../DefaultData'
import { GoogleMap } from './../GoogleMap/GoogleMap';
import { OwnerManagement } from './../../Modules/UserManagement/OwnerManagement'

export class SignedInUser implements SignedInUserBehavior {

    salonManagementDP: SalonManagement;
    userManagementDP: UserManagement;
    userId: string;

    constructor(userId: string, salonManagementDP: SalonManagement) {
        this.salonManagementDP = salonManagementDP;
        this.userId = userId;
    }

    /**
     * 
     * 
     * @param {SalonInformation} salonInformation
     * @returns {Promise<SalonCloudResponse<string>>}
     * 
     * @memberOf SignedInUser
     */
    public async createSalon(salonInformation: SalonInformation): Promise<SalonCloudResponse<string>> {

        var returnResult: SalonCloudResponse<string> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        // Create Salon Document
        var salonData = await this.salonManagementDP.createSalonDocs(salonInformation);
        console.log('SalonData:', salonData);
        if (salonData.err){
            returnResult.err = salonData.err;
            returnResult.code = salonData.code;
            return returnResult;
        }
        // Create default Schedule
        var scheduleDP = new SalonSchedule(salonData.data._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule);

        // Create Sample Services
        var serviceDP = new ServiceManagement(salonData.data._id);
        samplesService2.salon_id = salonData.data._id.toString();
        samplesService1.salon_id = salonData.data._id.toString();
        var addSample1Result = await serviceDP.addGroup(samplesService1);
        var addSample2Result = await serviceDP.addGroup(samplesService2);

        // Update User Profile
        var ownerManagementDP = new OwnerManagement(salonData.data._id);
        var profile = await ownerManagementDP.addOwnerProfile(this.userId); //Todo

        returnResult.data = salonData.data._id;
        returnResult.code = 200;
        return returnResult;
    };

    public getSalonList(): SalonCloudResponse<Array<SalonInformation>> {

        return;
    };

    public selectSalon(SalonId: string): SalonCloudResponse<boolean> {
        return;
    };



}