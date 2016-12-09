/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractAdministrator } from './AbstractAdministrator'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { UserProfile, UserData } from './../../Modules/UserManagement/UserData'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../Modules/Schedule/ScheduleData'
import { SalonInformation, SalonSetting } from './../../Modules/SalonManagement/SalonData'
import { Verification } from './../Verification/Verification'
import { Authentication } from './../Authentication/Authentication'
import { EmployeeManagement } from './../../Modules/UserManagement/EmployeeManagement'
import { ErrorMessage } from './../ErrorMessage'
import { BaseValidator } from './../Validation/BaseValidator'
import { IsPhoneNumber, IsValidSalonId, MissingCheck } from './../Validation/ValidationDecorators'
import { ServiceGroupData, ServiceItemData } from './../../Modules/ServiceManagement/ServiceData'
import { ServiceManagement } from './../../Modules/ServiceManagement/ServiceManagement'
import { Schedule } from './../../Modules/Schedule/Schedule'
import { defaultWeeklySchedule } from './../DefaultData'
import { EmployeeSchedule } from './../../Modules/Schedule/EmployeeSchedule'
import { EmployeeInput, EmployeeReturn } from './../../Modules/UserManagement/EmployeeData';
import { UserToken } from './../Authentication/AuthenticationData';

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
    public async addEmployee(username: string, employeeProfile: EmployeeInput, verificationObj: Verification): Promise<SalonCloudResponse<EmployeeReturn>> {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        }        

        // 'phone' validation
        var phoneNumberValidation = new BaseValidator(employeeProfile.phone);
        phoneNumberValidation = new MissingCheck(phoneNumberValidation, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidation = new IsPhoneNumber(phoneNumberValidation, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidation.validate();
        if (phoneNumberError) {
            response.err = phoneNumberError.err;
            response.code = 400;
            return response;
        }

        let employeeManagementDP = new EmployeeManagement(employeeProfile.salon_id);
        response = await employeeManagementDP.validation(employeeProfile);
        if (response.err) {
            return response;
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
            return response;
        } else {
            let content = 'Your account with Salonhelp has been successfully created! Username: ' + username + ', Password: ' + randomPasswordString;
            verificationObj.sendContent(username, content);
        }
        
        //Signin new employee
        let signinData: SalonCloudResponse<UserToken> = await authObject.signInWithUsernameAndPassword(username, randomPasswordString);

        // add new profile to the account
        let addProfileAction = await employeeManagementDP.addEmployeeProfile(signinData.data.user._id, employeeProfile);
        response.data = {
            uid: signinData.data.user._id,
            salon_id: employeeProfile.salon_id,
            username: username,
            phone: employeeProfile.phone,
            fullname: employeeProfile.fullname,
            role: employeeProfile.role,
        }

        // add default weeklySchedule Schedule
        // Create default Schedule
        var scheduleDP = new EmployeeSchedule(employeeProfile.salon_id, signinData.data.user._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule);
        
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
    public async addService(serviceGroup: any): Promise<SalonCloudResponse<ServiceGroupData>> {
        var response: SalonCloudResponse<ServiceGroupData> = {
            code: undefined,
            err: undefined,
            data: undefined
        };
        let serviceManagementDP = new ServiceManagement(serviceGroup.salon_id);
        // init and declare;
        var newServiceGroup: ServiceGroupData = {
            salon_id: serviceGroup.salon_id,
            description: serviceGroup.description,
            name: serviceGroup.group_name,
            service_list: serviceGroup.service_list,

        }

        // validation
        response = await serviceManagementDP.validateServiceGroup(newServiceGroup);
        if (response.err) {
            return response;
        }


        // adding service group
        var addingAction = await serviceManagementDP.addGroup(newServiceGroup);
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

    public updateSalonInformation(info: SalonInformation) {

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

    protected filterProfileData(user: UserProfile): UserProfile {

        return;
    }
}