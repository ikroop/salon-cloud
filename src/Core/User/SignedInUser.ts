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
            code: null,
            data: null,
            err: null
        };

        // Create Salon Document
        var salonData = await this.salonManagementDP.createSalonDocs(salonInformation);
        if (salonData.err) {
            returnResult.err = salonData.err;
            returnResult.code = salonData.code;
            return returnResult;
        }
        // Create default Schedule
        var scheduleDP = new SalonSchedule(salonData.data._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule);
        if (defaultSchedule.err) {
            returnResult.err = defaultSchedule.err;
            returnResult.code = defaultSchedule.code;
            return returnResult;
        }
        // Create Sample Services
        var serviceDP = new ServiceManagement(salonData.data._id);
        samplesService2.salon_id = salonData.data._id.toString();
        samplesService1.salon_id = salonData.data._id.toString();
        var addSample1Result = await serviceDP.addGroup(samplesService1);
        if (addSample1Result.err) {
            returnResult.err = addSample1Result.err;
            returnResult.code = addSample1Result.code;
            return returnResult;
        }
        var addSample2Result = await serviceDP.addGroup(samplesService2);

        if (addSample2Result.err) {
            returnResult.err = addSample2Result.err;
            returnResult.code = addSample2Result.code;
            return returnResult;
        }

        // Update User Profile
        var ownerManagementDP = new OwnerManagement(salonData.data._id);
        var profile = await ownerManagementDP.addOwnerProfile(this.userId); //Todo

        if (profile.err) {
            returnResult.err = profile.err;
            returnResult.code = profile.code;
            return returnResult;
        }

        returnResult.data = salonData.data._id;
        returnResult.code = 200;
        return returnResult;
    };
    
    /**
     * This method get the information off all the salons that connects to the user.
     * User Layer
     * @returns {Promise<SalonCloudResponse<Array<SalonInformation>>>}
     * 
     * @memberOf SignedInUser
     */
    public async getSalonList(): Promise<SalonCloudResponse<Array<SalonInformation>>> {
        var response : SalonCloudResponse<Array<SalonInformation>> = {
            code: null,
            data: null,
            err: null
        }
        var getAllSalon = await this.salonManagementDP.getAllSalon(this.userId);
        if(getAllSalon.err){
            response.err = getAllSalon.err;
            response.code = getAllSalon.code;
        }else{
            response.data = getAllSalon.data;
            response.code = getAllSalon.code;
        }
        return response;
    };

    public selectSalon(SalonId: string): SalonCloudResponse<boolean> {
        return;
    };



}