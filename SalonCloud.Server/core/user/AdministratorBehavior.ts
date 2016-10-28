/**
 * 
 * 
 * 
 * 
 * 
 */

import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { IDailyScheduleData, IWeeklyScheduleData } from './../../modules/schedule/ScheduleData';

export interface AdministratorBehavior {
    cancelAppointment(appointmentId: string);
    getAllCustomer(): Array<UserProfile>;
    getAllEmployeeProfile(): Array<UserProfile>;
    getCustomerById(customerId: string): UserProfile;
    getEmployeeProfile(employeeId: string): UserProfile;
    saveAppointment(appointment: AppointmentData);
    updateAppointment(appointment: AppointmentData);
    updateDailySchedule(employeeId: string, dailySchedule: IDailyScheduleData);
    updateWeeklySchedule(employeeId: string, weeklySchedule: IWeeklyScheduleData);
}