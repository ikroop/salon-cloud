


import { AppointmentManagementBehavior } from './AppointmentManagementBehavior'
import { AppointmentData } from './AppointmentData'
import AppointmentModel = require('./AppointmentModel');
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'

export class AppointmentManagement implements AppointmentManagementBehavior {

    public salonId: string;

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
            overlapped: {
                status: appointment.overlapped.status,
                overlapped_appointment_id: appointment.overlapped.overlapped_appointment_id
            },
            is_reminded: appointment.is_reminded,
            receipt_id: appointment.receipt_id,
            note: appointment.note,
            status: appointment.status,
            type: appointment.type
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

    public getAppointmentByDate(date: Date): Array<AppointmentData> {
        return;
    };

    public updateAppointment(appointmentId: string, appointment: AppointmentData): boolean {
        return;
    };


}
