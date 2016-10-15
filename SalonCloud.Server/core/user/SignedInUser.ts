

import { SignedInUserBehavior } from './SignedInUserBehavior'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { SalonManagement } from './../../modules/salonManagement/SalonManagement'
import { SalonInformation } from './../../modules/salonManagement/SalonData'
import { SalonSchedule } from './../../modules/schedule/SalonSchedule'
import { Schedule } from './../../modules/schedule/Schedule'
import { defaultWeeklySchedule } from './../defaultData'
import { UserManagement } from './../../modules/userManagement/UserManagement'
import { UserProfile } from './../../modules/userManagement/UserData'
import { ServiceManagement } from './../../modules/serviceManagement/ServiceManagement'
import { ServiceGroupData } from './../../modules/serviceManagement/ServiceData'
import { samplesService1, samplesService2 } from './../defaultData'
import { GoogleMap } from './../googlemap/GoogleMap';
import {OwnerManagement} from './../../modules/usermanagement/OwnerManagement'

export class SignedInUser implements SignedInUserBehavior {

    salonManagementDP: SalonManagement;
    userManagementDP: UserManagement;
    userId: string;

    constructor(userId: string, salonManagementDP: SalonManagement) {
        this.salonManagementDP = salonManagementDP;
        this.userId = userId;
    }

    /**
	*@name: createSalon
    *@parameter: SalonInformation
    *@return: a promise resolved to SalonCloudResponse<data>
    * - validation
    * - Get Timezone from address
    * - create default weekly schedule
    * - Create sample Services
    * - Update User Profile
	*/
    public async createSalon(salonInformation: SalonInformation) {

        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        // validation
        returnResult = await this.salonManagementDP.validation(salonInformation);
        if (returnResult.err){
            return returnResult;
        }
        // get Timezone from address and puts that into salon information constructor
        // TODO:
        var Timezone = await GoogleMap.getTimeZone(salonInformation.location.address);
        salonInformation.location.timezone_id = Timezone.timeZoneId;
        
        // Create Salon Document
        var salonData = await this.salonManagementDP.createSalonDocs(salonInformation);

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

        returnResult.data = {
            salon_id: salonData.data._id,
            uid: this.userId,
            role: profile.data.role,
            default_schedule: defaultSchedule.data,
            sample_services: [addSample1Result.data, addSample2Result.data],
            salon_data: salonData.data
        }
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