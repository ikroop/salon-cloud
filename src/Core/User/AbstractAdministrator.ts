/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractEmployee } from './AbstractEmployee'
import { UserProfile, UserData } from './../../Modules/UserManagement/UserData'
import { AppointmentItemData, AppointmentData, SaveAppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { AppointmentManagement } from './../../Modules/AppointmentManagement/AppointmentManagement'
import { AdministratorBehavior } from './AdministratorBehavior'
import { BookingAppointment } from './../../Modules/AppointmentManagement/BookingAppointment';
import { SalonCloudResponse } from './../SalonCloudResponse'
import { ErrorMessage } from './../ErrorMessage'
import { CustomerManagement } from './../../Modules/UserManagement/CustomerManagement'
import { Authentication } from './../Authentication/Authentication'
import { DailyScheduleData, WeeklyScheduleData } from './../../Modules/Schedule/ScheduleData'
import { ScheduleBehavior } from './../../Modules/Schedule/ScheduleBehavior'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { RoleDefinition } from './../../Core/Authorization/RoleDefinition'

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
            data: null,
            code: null,
            err: null
        }
        var salonId = inputData.salon_id;

        // FIX ME: build UserProfile
        var userProfile: UserProfile = {
            role: RoleDefinition.Customer.value,
            fullname: inputData.customer_name,
            salon_id: salonId,
            address: null,
            status: true,
            nickname: null,
            social_security_number: null,
            salary_rate: null,
            cash_rate: null,
            birthday: null
        }

        // Get customer Id
        var getCustomerId = await this.getCustomerId(inputData.customer_phone, userProfile);
        if (getCustomerId.err) {
            response.err = getCustomerId.err;
            response.code = getCustomerId.code;
            return response;
        }

        //Todo:  validation

        var newAppointment: AppointmentData = {
            customer_id: getCustomerId.data,
            device: null,
            appointment_items: inputData.services,
            payment_id: null,
            total: null,
            salon_id: salonId,
            status: null, //TODO: add default data
            is_reminded: null,
            note: inputData.note,
            type: null
        };

        var appointmentByPhone: BookingAppointment = new BookingAppointment(salonId, new AppointmentManagement(salonId));

        appointmentByPhone.normalizationData(newAppointment);               

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
            data: null,
            code: null,
            err: null
        };
        var customerManagementDP = new CustomerManagement(customerProfile.salon_id);

        var customer = await customerManagementDP.getUserByPhone(phone);
        if (customer.err){
            response.err = customer.err;
            response.code = customer.code;
            return response;
        }
        if (!customer.data) {
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
            if (customer.data.profile === null || customer.data.profile.length === 0) {
                //create customer profile for this salon
                var newCustomerProfile = await customerManagementDP.addCustomerProfile(customer.data._id, customerProfile);
                if (newCustomerProfile.err) {
                    response.err = newCustomerProfile.err;
                    response.code = newCustomerProfile.code;
                    return response;
                }
            }
            response.data = customer.data._id;
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
    public async updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<any> = {
            code: null,
            data: null,
            err: null
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
    public async updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<any> = {
            code: null,
            data: null,
            err: null
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

