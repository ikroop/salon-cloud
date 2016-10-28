

import { AbstractEmployee } from './AbstractEmployee'
import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyScheduleData, WeeklyScheduleData } from './../../modules/schedule/ScheduleData'
import { AdministratorBehavior } from './AdministratorBehavior'
import { PhoneCallAppointment } from './../../modules/appointmentManagement/PhoneCallAppointment';

export abstract class AbstractAdministrator extends AbstractEmployee implements AdministratorBehavior{

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
        var appointmentByPhone: PhoneCallAppointment;
        
        // Check booking available time

        var bookingTimeList = appointmentByPhone.checkBookingAvailableTimes(appointment);

        if (!bookingTimeList){
            return;
        }

        // Salon has available time for appointment

        // Create customer with phone number if necessary
        // OR find customer by phone
        // get customer id
        
        // create receipt 
        // TODO:

        // create appointment
        var result = appointmentByPhone.createAppointment(appointment);

        // Normalization return data
        // TODO:

        return;

    };

    public updateAppointment(appointment: AppointmentData) {

    };

    public updateDailySchedule(employeeId: string, dailySchedule: DailyScheduleData) {

    };

    public updateWeeklySchedule(employeeId: string, weeklySchedule: WeeklyScheduleData) {

    };

    protected filterAppointmentFields(appointment: AppointmentData): AppointmentData {
        return;
    };

    protected abstract filterProfileData(user: UserProfile): UserProfile;
}