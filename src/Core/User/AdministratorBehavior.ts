/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserProfile } from './../../Modules/UserManagement/UserData'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyScheduleData } from './../../Modules/Schedule/ScheduleData';

export interface AdministratorBehavior {
    cancelAppointment(appointmentId: string);
    getAllCustomer(): Array<UserProfile>;
    getAllEmployeeProfile(): Array<UserProfile>;
    getCustomerById(customerId: string): UserProfile;
    getEmployeeProfile(employeeId: string): UserProfile;
    saveAppointment(appointment: AppointmentData);
    updateAppointment(appointment: AppointmentData);
    updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData);
    updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData);
}