/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { AppointmentData, AppointmentItemData } from './../../Modules/AppointmentManagement/AppointmentData';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData';

export interface AppointmentManagementDatabaseInterface<T> {
    createAppointment(salon: AppointmentData): Promise<T>;
    getEmployeeAppointmentByDate(employeeId: string, date: SalonTimeData):Promise<SalonCloudResponse<AppointmentItemData>>;
}