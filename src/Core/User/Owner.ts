/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractAdministrator } from './AbstractAdministrator'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { UserProfile, UserData, IUserData } from './../../Modules/UserManagement/UserData'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../Modules/Schedule/ScheduleData'
import { SalonInformation, SalonSetting, SalonData, ISalonData } from './../../Modules/SalonManagement/SalonData'
import { Verification } from './../Verification/Verification'
import { Authentication } from './../Authentication/Authentication'
import { EmployeeManagement } from './../../Modules/UserManagement/EmployeeManagement'
import { ErrorMessage } from './../ErrorMessage'
import { BaseValidator } from './../Validation/BaseValidator'
import { IsPhoneNumber, IsValidSalonId, MissingCheck } from './../Validation/ValidationDecorators'
import { ServiceGroupData, ServiceItemData, IServiceGroupData } from './../../Modules/ServiceManagement/ServiceData'
import { ServiceManagement } from './../../Modules/ServiceManagement/ServiceManagement'
import { Schedule } from './../../Modules/Schedule/Schedule'
import { defaultWeeklySchedule } from './../DefaultData'
import { EmployeeSchedule } from './../../Modules/Schedule/EmployeeSchedule'
import { EmployeeReturn } from './../../Modules/UserManagement/EmployeeData';
import { UserToken } from './../Authentication/AuthenticationData';
import { SalonManagement } from './../../Modules/SalonManagement/SalonManagement';

export class Owner extends AbstractAdministrator {

    /**
     * @name: addEmployee
     * @param: {salonId: string, employeeData: UserData, verificationObj: Verification}
     * @return: Promise<SalonCloudResponse<EmployeeReturn>>
     * @returnDataStructure: {
     *  salon_id: string,
     *  uid: string,
     *  username: string,
     *  fullname: string,
     *  role: number
     *  }
     * -- validation;
     * -- create employee account with username
     * -- send verification if successfully create account
     * -- add new profile to the account
     * -- return 
     *     - uid: accountCreation.data.user._id,
     *     - salon_id: employeeProfile.salon_id,
     *     - username: username,
     *     - phone: employeeProfile.phone,
     *     - fullname: employeeProfile.fullname,
     *     - role: employeeProfile.role
     */
    public async addEmployee(username: string, employeeProfile: UserProfile, verificationObj: Verification): Promise<SalonCloudResponse<EmployeeReturn>> {
        var response: SalonCloudResponse<any> = {
            code: null,
            data: null,
            err: null
        }

        // create employee account with username;
        var authObject = new Authentication();
        var randomPassword = 100000 + Math.floor(Math.random() * 900000);
        var randomPasswordString = randomPassword.toString();

        var accountCreation = await authObject.signUpWithUsernameAndPassword(username, randomPasswordString);

        // send verification if successfully create account
        if (accountCreation.err) {
            response.err = accountCreation.err;
            response.code = accountCreation.code;
            return response; // Return Error if registering error
        } else {
            let content = 'Your account with Salonhelp has been successfully created! Username: ' + username + ', Password: ' + randomPasswordString;
            verificationObj.sendContent(username, content);
        }

        //Signin new employee
        let signinData: SalonCloudResponse<UserToken> = await authObject.signInWithUsernameAndPassword(username, randomPasswordString);

        if (signinData.err) {
            response.err = signinData.err;
            response.code = signinData.code;
            return response; // Return Error if signing in error
        }

        // add new profile to the account
        let employeeManagementDP = new EmployeeManagement(employeeProfile.salon_id);
        let addProfileAction = await employeeManagementDP.addEmployeeProfile(signinData.data.user._id, employeeProfile);

        if (addProfileAction.err) {
            response.err = addProfileAction.err;
            response.code = addProfileAction.code;
            return response; //Return Error if adding employee error
        }

        // add default weeklySchedule Schedule
        // Create default Schedule
        var scheduleDP = new EmployeeSchedule(employeeProfile.salon_id, signinData.data.user._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule);

        if (defaultSchedule.err) {
            response.err = defaultSchedule.err;
            response.code = defaultSchedule.code;
            return response; //Return Error if adding default schedule error
        }

        response.data = {
            uid: signinData.data.user._id,
            salon_id: employeeProfile.salon_id,
            username: username,
            phone: employeeProfile.phone,
            fullname: employeeProfile.fullname,
            role: employeeProfile.role,
            password: randomPasswordString
        }

        response.code = 200;
        return response;
    }

    public activateEmployee(employeeId: string): SalonCloudResponse<boolean> {

        return;
    };

    public activateSalon(salonId: string): boolean {

        return;

    };
    /**
     * @name: addService
     * @param: {serviceGroup: any}
     * @paramDataStructures:
     *  serviceGroup : {
     *          group_name: require
                description: require
                salon_id: require
                service_list: optional [
            {
                    name: require
                    price: number, require
                    time: number, require
            }
        ]
     * }
     * 
     * @return: Promise<SalonCloudResponse<ServiceGroupData>>
     * @returnDataStructure: 
     * {
     *          group_name: require
                description: require
                salon_id: require
                service_list: optional [
            {
                    name: require
                    price: number, require
                    time: number, require
            }
        ]
     * }
     * 
     * -- validation
     * -- init serviceManagementDP and declare newServiceGroup
     * -- addService via serviceManagementDP.addGroup() method
     * -- return
     * 
     */
    public async addService(serviceGroup: ServiceGroupData): Promise<SalonCloudResponse<IServiceGroupData>> {
        var response: SalonCloudResponse<IServiceGroupData> = {
            code: null,
            err: null,
            data: null
        };
        let serviceManagementDP = new ServiceManagement(serviceGroup.salon_id);
        // adding service group
        var addingAction = await serviceManagementDP.addGroup(serviceGroup);
        // return
        if (addingAction.err) {
            response.err = addingAction.err;
            response.code = addingAction.code;
            return response;
        } else {
            response.data = addingAction.data;
            response.code = addingAction.code;
            return response;
        }
    };

    public deactivateEmployee(emplpoyeeId: string): boolean {

        return;
    };

    public deativateSalon(salonId: string): boolean {
        return;
    };

    public removeService() {

        return;
    };

    public updateEmployeeProfile(employee: UserProfile): boolean {

        return;
    };

    public updateSalonDailySchedule(dailySchedule: DailyDayData) {

    };

    public async updateSalonInformation(info: SalonInformation): Promise<SalonCloudResponse<ISalonData>> {
        var response: SalonCloudResponse<ISalonData> = {
            code: null,
            err: null,
            data: null
        };

        var updateResult = await this.salonManagementDP.updateInformation(info);
        response.code = updateResult.code;
        if (!updateResult.err) {
            response.data = updateResult.data;
        } else {
            response.err = updateResult.err;
        }

        return response;
    };

    public updateSalonSetting(setting: SalonSetting) {

    };

    public updateSalonWeeklySchedule(weeklySchedule: WeeklyDayData) {

    };

    public updateService() {

    };

    public getSchedule(start: Date, end: Date): SalonCloudResponse<Array<DailyDayData>> {

        return;
    };

    protected filterEmployeeProfileData(employeeList: IUserData[]): IUserData[] {
        return employeeList;
    }

    public async getSalonSettings(salonId: string): Promise<SalonCloudResponse<SalonSetting>> {

        var response: SalonCloudResponse<SalonSetting> = {
            code: null,
            err: null,
            data: null
        };

        var salonManagement = new SalonManagement(salonId);
        var salonProfile = await salonManagement.getSalonById();

        response.code = salonProfile.code;
        if (!salonProfile.err) {
            response.data = salonProfile.data.setting;
        } else {
            response.err = salonProfile.err;
        }

        return response;
    };
}