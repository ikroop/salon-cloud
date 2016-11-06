

import { AppointmentData, AppointmentItemData } from './AppointmentData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import {SalonTimeData} from './../../Core/SalonTime/SalonTimeData'

export interface AppointmentManagementBehavior {

    cancelAppointment(appointmentId: string): boolean;

    createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>>;

    getAppointment(appointmentId: string): AppointmentData;

    getAppointmentByCustomer(customerId: string): Array<AppointmentData>;

    getEmployeeAppointmentByDate(employeeId: string, date: SalonTimeData): Promise<SalonCloudResponse<Array<AppointmentItemData>>> ;

    updateAppointment(appointmentId: string, appointment: AppointmentData): boolean;

}