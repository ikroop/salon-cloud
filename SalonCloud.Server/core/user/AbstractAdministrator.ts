

import { AbstractEmployee } from './AbstractEmployee'
import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../modules/schedule/ScheduleData'

export abstract class AbstractAdministrator extends AbstractEmployee {

    public cancelAppointment(appointmentId: string) {

    };

    public getAllCustomer(): Array<UserProfile> {
        return new Array<UserProfile>();

    };

    public getAllEmployeeProfile(): Array<UserProfile> {
        return new Array<UserProfile>();
    };

    public getCustomerById(customerId: string): UserProfile {
        return;
    };

    public getEmployeeProfile(employeeId: string): UserProfile {
        return;
    };

    public saveAppointment(appointment: AppointmentData) {

    };

    public updateAppointment(appointment: AppointmentData) {

    };

    public updateDailySchedule(employeeId: string, dailySchedule: DailyDayData) {

    };

    public updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyDayData) {

    };

    protected filterAppointmentFields(appointment: AppointmentData): AppointmentData {
        return;
    };

    protected abstract filterProfileData(user: UserProfile): UserProfile;
}