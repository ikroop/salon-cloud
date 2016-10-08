

import {SignedInUserBehavior} from './SignedInUserBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {SalonManagement} from './../../modules/salonManagement/SalonManagement'
import {SalonInformation} from './../../modules/salonManagement/SalonData'
import {SalonSchedule} from './../../modules/schedule/SalonSchedule'
import {Schedule} from './../../modules/schedule/Schedule'
import {defaultWeeklySchedule} from './../defaultData'
import {UserManagement} from './../../modules/userManagement/UserManagement'
import {UserProfile} from './../../modules/userManagement/UserProfile'
import {ServiceManagement} from './../../modules/serviceManagement/ServiceManagement'
import {ServiceGroupData} from './../../modules/serviceManagement/ServiceData'
import {samplesService1, samplesService2} from './../defaultData'


export class SignedInUser implements SignedInUserBehavior {

    salonManagementDP: SalonManagement;
    UserManagementDP: UserManagement;
    //Todo: neccesary??
    //salonScheduleDP: Schedule;

    constructor(salonManagementDP: SalonManagement) {
        this.salonManagementDP = salonManagementDP;

    }

    public async createSalon(salonInformation: SalonInformation): SalonCloudResponse<SalonInformation> {

        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //step 1: validation;

        //step 2: create salon docs;
        var salonData = await this.salonManagementDP.createSalonDocs(salonInformation);

        //step 3: create default schedule;
        var scheduleDP = new SalonSchedule(salonData.data._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule); 

        //step 4: create sample services;
        var serviceDP = new ServiceManagement(salonData.data._id);

        var sampleServices:[ServiceGroupData]= [samplesService1, samplesService2];

        var addSampleServicesAction = await serviceDP.addGroupArray(sampleServices); //Todo

        //step 5: update user profile;
        var profile = this.addNewProfile(salonData.data._id); //Todo
         
        returnResult.data = {
            salon_id: salonData.data._id,
            uid: this.UserManagementDP.user_id,
            role: profile.data.role,
        }
        returnResult.err = 200;
        return returnResult;
    };

    public getSalonList(): SalonCloudResponse<Array<SalonInformation>> {

        return;
    };

    public selectSalon(SalonId: string): SalonCloudResponse<boolean> {
        return;
    };

    public async addNewProfile(salonId: string): SalonCloudResponse<UserProfile> {

        var returnResult = await this.UserManagementDP.addProfile(salonId, 1);
        return returnResult;
    };


}