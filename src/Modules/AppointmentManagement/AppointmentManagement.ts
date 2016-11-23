/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AppointmentManagementBehavior } from './AppointmentManagementBehavior'
import { AppointmentData, AppointmentItemData } from './AppointmentData'
import AppointmentModel = require('./AppointmentModel');
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { SalonTime } from './../../Core/SalonTime/SalonTime'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'

export class AppointmentManagement implements AppointmentManagementBehavior {

    public salonId: string;

    constructor(salonId: string){
        this.salonId = salonId;
    }

    public cancelAppointment(appointmentId: string): boolean {
        return;
    };

    public async createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>> {
        var response: SalonCloudResponse<AppointmentData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }

        var newAppointment: AppointmentData = {
            customer_id: appointment.customer_id,
            device: appointment.device,
            salon_id: appointment.salon_id,
            appointment_items: appointment.appointment_items,
            is_reminded: appointment.is_reminded,
            note: appointment.note,
            status: appointment.status,
            type: appointment.type,
            total: appointment.total,
        }
        var appointmentCreation = AppointmentModel.create(newAppointment);
        await appointmentCreation.then(function (docs) {
            response.data = docs;
            response.code = 200;
        }, function (err) {
            response.err = err;
            response.code = 500;
        })

        return response;
    };

    public getAppointment(appointmentId: string): AppointmentData {
        return;
    };

    public getAppointmentByCustomer(customerId: string): Array<AppointmentData> {
        return;
    };

    public async getEmployeeAppointmentByDate(employeeId: string, date: SalonTimeData): Promise<SalonCloudResponse<Array<AppointmentItemData>>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: undefined,
            code: undefined,
            err: undefined
        }

        var appointmentSearch = AppointmentModel.find({
            'appointment_items.employee_id': employeeId,
            'appointment_items.start.year': date.year,
            'appointment_items.start.month': date.month,
            'appointment_items.start.day': date.day
        }).exec();

        await appointmentSearch.then(function (docs) {
            console.log('Docs: ', docs);
            if (!docs) {
                response.data = [];
                response.code = 200;
            } else {
                var appointmentArray: Array<AppointmentItemData> =[];
                for (let eachAppointment of docs) {
                    console.log('AAA: ', eachAppointment.appointment_items);
                    for (let eachItem of eachAppointment.appointment_items) {
                        if (eachItem.employee_id == employeeId) {
                            appointmentArray.push(eachItem);
                        }
                    }
                }

                response.data = appointmentArray;
                console.log('AppointmentArray: ',appointmentArray);
                response.code = 200;
            }
        }, function (err) {
            response.err = err;
            response.code = 500;
        })
        return response;
    };

    public updateAppointment(appointmentId: string, appointment: AppointmentData): boolean {
        return;
    };


}
