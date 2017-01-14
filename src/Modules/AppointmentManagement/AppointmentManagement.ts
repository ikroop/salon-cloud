/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AppointmentManagementBehavior } from './AppointmentManagementBehavior'
import { AppointmentData, AppointmentItemData, IAppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { SalonTime } from './../../Core/SalonTime/SalonTime'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { AppointmentManagementDatabaseInterface } from './../../Services/AppointmentDatabase/AppointmentManagementDatabaseInterface';
import { FirebaseAppointmentManagement } from './../../Services/AppointmentDatabase/Firebase/FirebaseAppointmentDatabase';

export class AppointmentManagement implements AppointmentManagementBehavior {

    public salonId: string;
    private appointmentDatabase: AppointmentManagementDatabaseInterface<IAppointmentData>;

    constructor(salonId: string) {
        this.salonId = salonId;
        this.appointmentDatabase = new FirebaseAppointmentManagement(this.salonId);
    }

    public cancelAppointment(appointmentId: string): boolean {
        return;
    };

    /**
     * 
     * 
     * @param {AppointmentData} appointment
     * @returns {Promise<SalonCloudResponse<AppointmentData>>}
     * 
     * @memberOf AppointmentManagement
     */
    public async createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<IAppointmentData>> {
        var response: SalonCloudResponse<AppointmentData> = {
            data: null,
            code: null,
            err: null
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

        try {
            var appointmentCreation = await this.appointmentDatabase.createAppointment(newAppointment);
            response.data = appointmentCreation;
            response.code = 200;
        } catch (error) {
            response.err = error;
            response.code = 500;
        }

        return response;
    };

    public getAppointment(appointmentId: string): AppointmentData {
        return;
    };

    public getAppointmentByCustomer(customerId: string): Array<AppointmentData> {
        return;
    };

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {SalonTimeData} date
     * @returns {Promise<SalonCloudResponse<Array<AppointmentItemData>>>}
     * 
     * @memberOf AppointmentManagement
     */
    public async getEmployeeAppointmentByDate(employeeId: string, date: SalonTimeData): Promise<SalonCloudResponse<Array<AppointmentItemData>>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: null,
            code: null,
            err: null
        }
        try {
            var appointmentItemList = await this.appointmentDatabase.getEmployeeAppointmentByDate(employeeId, date);
            response.data = appointmentItemList;
            response.code = 200;
        } catch (error) {
            response.err = error;
            response.code = 500;
        }
        
        return response;
    };

    public updateAppointment(appointmentId: string, appointment: AppointmentData): boolean {
        return;
    };


}
