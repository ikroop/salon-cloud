

import { AppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'

export interface AppointmentManagementBehavior {

    cancelAppointment(appointmentId: string): boolean;

    createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>>;

    getAppointment(appointmentId: string): AppointmentData;

    getAppointmentByCustomer(customerId: string): Array<AppointmentData>;

    getAppointmentByDate(date: Date): Array<AppointmentData>;

    updateAppointment(appointmentId: string, appointment: AppointmentData): boolean;

}