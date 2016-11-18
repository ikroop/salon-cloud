/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AbstractEmployee } from './AbstractEmployee'
import { UserProfile, UserData } from './../../Modules/UserManagement/UserData'
import UserModel = require('./../../Modules/UserManagement/UserModel');
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { AdministratorBehavior } from './AdministratorBehavior'
import { BookingAppointment } from './../../Modules/AppointmentManagement/BookingAppointment';
import { SalonCloudResponse } from './../SalonCloudResponse'
import { ErrorMessage } from './../ErrorMessage'
import { CustomerManagement } from './../../Modules/UserManagement/CustomerManagement'
import { Authentication } from './../Authentication/Authentication'
import { IDailyScheduleData, IWeeklyScheduleData } from './../../Modules/Schedule/ScheduleData'
import { ReceiptManagement } from './../../Modules/Receipt/ReceiptManagement'

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
        var response: SalonCloudResponse<string> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        //Todo:  validation


        var salonId = inputData.salon_id;
        var appointmentByPhone: BookingAppointment;
        var receiptManagementDP = new ReceiptManagement(salonId);

        // Check booking available time

        var bookingTimeList = appointmentByPhone.checkBookingAvailableTimes(inputData);

        if (!bookingTimeList) {
            return;
        }

        // Salon has available time for appointment

        // Get customer Id
        var getCustomerId = await this.getCustomerID(salonId, inputData);
        if (getCustomerId.err) {
            response.err = getCustomerId.err;
            response.code = getCustomerId.code;
            return response;
        }

        // create receipt 
        var receiptCreation = await receiptManagementDP.add(inputData);
        if (receiptCreation.err) {
            response.err = receiptCreation.err;
            response.code = receiptCreation.code;
            return response;
        }

        // create appointment
        var result: any = await appointmentByPhone.createAppointment(inputData);
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
            return response;
        }

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
        var customerManagementDP = new CustomerManagement(salonId);
        var userFinding = UserModel.findOne({ 'username': inputData.customer_phone }).exec();
        await userFinding.then(async function (docs) {
            // customer account existed, get Id and check if needed to create profile for salon;
            if (docs) {
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
                var customerCreation: any = await customerManagementDP.createCustomer(inputData);
                response.data = customerCreation.data._id;
                response.code = 200;
                return response;
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