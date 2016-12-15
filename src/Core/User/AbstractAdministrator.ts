/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractEmployee } from './AbstractEmployee'
import { UserProfile, UserData } from './../../Modules/UserManagement/UserData'
import UserModel = require('./../../Modules/UserManagement/UserModel');
import { AppointmentItemData, AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { AppointmentManagement } from './../../Modules/AppointmentManagement/AppointmentManagement'
import { AdministratorBehavior, SaveAppointmentData } from './AdministratorBehavior'
import { BookingAppointment } from './../../Modules/AppointmentManagement/BookingAppointment';
import { SalonCloudResponse } from './../SalonCloudResponse'
import { ErrorMessage } from './../ErrorMessage'
import { CustomerManagement } from './../../Modules/UserManagement/CustomerManagement'
import { Authentication } from './../Authentication/Authentication'
import { DailyScheduleData, WeeklyScheduleData } from './../../Modules/Schedule/ScheduleData'
import { ScheduleBehavior } from './../../Modules/Schedule/ScheduleBehavior'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'


export abstract class AbstractAdministrator extends AbstractEmployee implements AdministratorBehavior {

    public cancelAppointment(appointmentId: string) {

    };

    public getAllCustomer(): Array<UserProfile> {
        return new Array<UserProfile>();

    };

    public getAllEmployeeProfile(): Array<UserProfile> {
        return new Array<UserProfile>();
    };

    public getCustomerById(customerId: string): UserProfile {
        return;
    };

    public getEmployeeProfile(employeeId: string): UserProfile {
        return;
    };

    public async saveAppointment(inputData: SaveAppointmentData): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<any> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        //Todo:  validation

        var salonId = inputData.salon_id;
        var newAppointment: AppointmentData = {
            customer_id: undefined,
            device: undefined,
            appointment_items: undefined,
            payment_id: undefined,
            total: undefined,
            salon_id: salonId,
            status: undefined, //TODO: add default data
            is_reminded: undefined,
            note: inputData.note,
            type: undefined
        };


        var appointmentByPhone: BookingAppointment = new BookingAppointment(salonId, new AppointmentManagement(salonId));
        /*var validation = await appointmentByPhone.validation(newAppointment);
        if (validation.err) {
            response.err = validation.err;
            response.code = validation.code;
            return response;
        }*/
        appointmentByPhone.normalizationData(newAppointment);

        // FIX ME: build UserProfile
        var userProfile: UserProfile = {
            role: 4,
            fullname: inputData.customer_name,
            salon_id: inputData.salon_id
        }
        // Get customer Id
        var getCustomerId = await this.getCustomerId(inputData.customer_phone, userProfile);
        if (getCustomerId.err) {
            response.err = getCustomerId.err;
            response.code = getCustomerId.code;
            return response;
        }

        newAppointment.customer_id = getCustomerId.data;
        // get available time
        var appointmentItemsArray: Array<AppointmentItemData>;
        // create Service
        var timeAvalibilityCheck = await appointmentByPhone.checkBookingAvailableTime(inputData.services);

        if (timeAvalibilityCheck.err) {
            response.err = timeAvalibilityCheck.err;
            response.data = timeAvalibilityCheck.data;
            response.code = timeAvalibilityCheck.code;
            return response;
        } else {
            appointmentItemsArray = timeAvalibilityCheck.data;
        }
        // Salon has available time for appointment, process to save appointment
        newAppointment.appointment_items = appointmentItemsArray;

        // create appointment
        var result: any = await appointmentByPhone.createAppointment(newAppointment);
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
            return response;
        }
        // Normalization return data
        response.data = {
            appointment_id: result.data._id
        };
        response.code = 200;
        // TODO:

        return response;

    };

    /**
     * 
     * 
     * @private
     * @param {string} phone
     * @param {UserProfile} customerProfile
     * @returns {Promise<SalonCloudResponse<string>>}
     * 
     * @memberOf AbstractAdministrator
     */
    private async getCustomerId(phone: string, customerProfile: UserProfile): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<string> = {
            data: undefined,
            code: undefined,
            err: undefined
        };
        console.log('PHONE: ', phone)
        var customerManagementDP = new CustomerManagement(customerProfile.salon_id);

        var customer = await customerManagementDP.getUserByPhone(phone);
        if (!customer) {
            // customer account not existed, create account with salon profile for the user                
            var customerCreation = await customerManagementDP.createCustomer(phone, customerProfile);
            if (customerCreation.err) {
                response.err = customerCreation.err;
                response.code = customerCreation.code;
                return response;
            } else {
                response.data = customerCreation.data.user._id;
                response.code = 200;
                return response;
            }
        } else {
            if (customer.profile.length === 0) {
                //create customer profile for this salon
                var newCustomerProdile = await customerManagementDP.addCustomerProfile(customer._id, customerProfile);
                if (newCustomerProdile.err) {
                    response.err = newCustomerProdile.err;
                    response.code = newCustomerProdile.code;
                    return response;
                }
            }
            response.data = customer._id;
            response.code = 200;
            return response;
        }

    }

    public updateAppointment(appointment: AppointmentData) {

    };

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyScheduleData} dailySchedule
     * @param {ScheduleBehavior} schedule
     * @returns {Promise<SalonCloudResponse<any>>}
     * 
     * @memberOf AbstractAdministrator
     */
    public async updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<undefined>> {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        }


        //call saveDailySchedule method;
        var result = await schedule.saveDailySchedule(dailySchedule.day);

        //get result;
        //TODO: review requirement for information returned;
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
        } else {
            response.code = result.code;
            response.data = result.data;
        }
        return response;

    };

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {WeeklyScheduleData} weeklySchedule
     * @param {ScheduleBehavior} schedule
     * @returns {Promise<SalonCloudResponse<any>>}
     * 
     * @memberOf AbstractAdministrator
     */
    public async updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<undefined>> {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        }


        //call saveDailySchedule method;
        var result = await schedule.saveWeeklySchedule(weeklySchedule.week);

        //get result;
        //TODO: review requirement for information returned;
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
        } else {
            response.code = result.code;
            response.data = result.data;
        }
        return response;

    };

    protected filterAppointmentFields(appointment: AppointmentData): AppointmentData {
        return;
    };

    protected abstract filterProfileData(user: UserProfile): UserProfile;
}

