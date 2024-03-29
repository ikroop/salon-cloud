/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserProfile, IUserData } from './../../Modules/UserManagement/UserData'
import { AppointmentData, SaveAppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyScheduleData } from './../../Modules/Schedule/ScheduleData';
import { ScheduleBehavior } from './../../Modules/Schedule/ScheduleBehavior'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'

export interface AdministratorBehavior {
    cancelAppointment(appointmentId: string);
    getAllCustomer(): Array<UserProfile>;
    getAllEmployeeProfile(salonId: string): Promise<SalonCloudResponse<IUserData[]>>;
    getCustomerById(customerId: string): UserProfile;
    getEmployeeProfile(employeeId: string): UserProfile;
    saveAppointment(appointment: SaveAppointmentData);
    updateAppointment(appointment: AppointmentData);
    updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<IDailyScheduleData>>;
    updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData, schedule: ScheduleBehavior): Promise<SalonCloudResponse<IWeeklyScheduleData>>;
}