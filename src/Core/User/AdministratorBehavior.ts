/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserProfile } from './../../Modules/UserManagement/UserData'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyScheduleData } from './../../Modules/Schedule/ScheduleData';
import { ScheduleBehavior } from './../../Modules/Schedule/ScheduleBehavior'

export interface AdministratorBehavior {
    cancelAppointment(appointmentId: string);
    getAllCustomer(): Array<UserProfile>;
    getAllEmployeeProfile(): Array<UserProfile>;
    getCustomerById(customerId: string): UserProfile;
    getEmployeeProfile(employeeId: string): UserProfile;
    saveAppointment(appointment: AppointmentData);
    updateAppointment(appointment: AppointmentData);
    updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData, schedule: ScheduleBehavior);
    updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData, schedule: ScheduleBehavior);
}