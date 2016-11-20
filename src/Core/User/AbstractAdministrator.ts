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
import { AdministratorBehavior } from './AdministratorBehavior'
import { BookingAppointment } from './../../Modules/AppointmentManagement/BookingAppointment';
import { SalonCloudResponse } from './../SalonCloudResponse'
import { ErrorMessage } from './../ErrorMessage'
import { CustomerManagement } from './../../Modules/UserManagement/CustomerManagement'
import { Authentication } from './../Authentication/Authentication'
import { IDailyScheduleData, IWeeklyScheduleData } from './../../Modules/Schedule/ScheduleData'

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

    public async saveAppointment(inputData: any): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<any> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        //Todo:  validation


        var salonId = inputData.salon_id;
        var appointmentByPhone: BookingAppointment = new BookingAppointment(salonId, new AppointmentManagement(salonId));
        console.log('1')
        // Get customer Id
        var getCustomerId = await this.getCustomerID(salonId, inputData);
        if (getCustomerId.err) {
            response.err = getCustomerId.err;
            response.code = getCustomerId.code;
            return response;
        }

        // get available time
        var appointmentItemsArray: [AppointmentItemData];
        // create Service
        console.log('2', appointmentByPhone);
        console.log('inputData.services:', inputData.services);
        var timeAvalibilityCheck = await appointmentByPhone.checkBookingAvailableTime(inputData.services);

        if (timeAvalibilityCheck.err) {
            response.err = timeAvalibilityCheck.err;
            response.data = timeAvalibilityCheck.data;
            response.code = timeAvalibilityCheck.code;
            return response;
        } else {
            appointmentItemsArray = response.data;
        }
        console.log('3');
        // Salon has available time for appointment, process to save appointment
        var newAppointment: AppointmentData = {
            customer_id: inputData.customer_id,
            device: inputData.device,
            appointment_items: appointmentItemsArray,
            payment_id: undefined,
            total: undefined,
            salon_id: salonId,
            status: undefined, //TODO: add default data
            is_reminded: false,
            note: inputData.note,
            type: 1
        }


        // create appointment
        var result: any = await appointmentByPhone.createAppointment(newAppointment);
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
            return response;
        }
        console.log('4')
        // Normalization return data
        response.data = result.data._id;
        response.code = 200;
        // TODO:

        return response;

    };


    private async getCustomerID(salonId: string, inputData: any): Promise<SalonCloudResponse<string>> {
        var response: SalonCloudResponse<string> = {
            data: undefined,
            code: undefined,
            err: undefined
        };
        console.log('innn', salonId);
        var customerManagementDP = new CustomerManagement(salonId);
        var userFinding = UserModel.findOne({ 'username': inputData.customer_phone }).exec();
        await userFinding.then(async function (docs) {
            // customer account existed, get Id and check if needed to create profile for salon;
            if (docs) {
                console.log('innnHave:', docs);
                response.data = docs._id;
                response.code = 200;
                var flag = false;
                // check if salon profile existed for the customer and create one if needed;
                for (let each of docs.profile) {
                    if (salonId === each.salon_id) {
                        flag = true;
                        break;
                    }
                }
                if (flag === false) {
                    var customerProfileCreation = await customerManagementDP.addCustomerProfile(docs._id, inputData)
                }
                return response;


            } else {
                // customer account not existed, create account with salon profile for the user
                console.log('innDontHave:', inputData);
                var customerCreation: any = await customerManagementDP.createCustomer(inputData);
                if (customerCreation.err) {
                    console.log('inininErr:', customerCreation.err);
                    response.err = customerCreation.err;
                    response.code = customerCreation.code;
                    return response;
                } else {
                    console.log('inininData:', customerCreation.data);
                    response.data = customerCreation.data._id;
                    response.code = 200;
                    return response;
                }
            }
        }, function (err) {
            response.err = err;
            response.code = 500;
        })

        return response;

    }

    public updateAppointment(appointment: AppointmentData) {

    };
    public updateDailySchedule(employeeId: string, dailySchedule: IDailyScheduleData) {

    };

    public updateWeeklySchedule(employeeId: string, weeklySchedule: IWeeklyScheduleData) {

    };

    protected filterAppointmentFields(appointment: AppointmentData): AppointmentData {
        return;
    };

    protected abstract filterProfileData(user: UserProfile): UserProfile;
}