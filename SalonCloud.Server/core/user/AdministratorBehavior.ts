/**
 * 
 * 
 * 
 * 
 * 
 */

import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyScheduleData, WeeklyScheduleData } from './../../modules/schedule/ScheduleData';

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