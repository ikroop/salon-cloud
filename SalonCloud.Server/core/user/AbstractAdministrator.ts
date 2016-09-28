

import {AbstractEmployee} from './AbstractEmployee'

export abstract class AbstractAdministrator extends AbstractEmployee {
    
    public cancelAppointment(appointmentId : string){

    };

    public getAllCustomer() : Array<UserProfile>{

    };

    public getAllEmployeeProfile() : Array<UserProfile>{

    };

    public getCustomerById(customerId : string) : UserProfile{

    };

    public getEmployeeProfile(employeeId : string) : UserProfile{

    };

    public saveAppointment(appointment : Appointment){

    };

    public updateAppointment(appointment : Appointment){

    };

    public updateDailySchedule(employeeId : string, dailySchedule : DailySchedule){

    };

    public updateWeeklySchedule(employeeId : string, weeklySchedule : WeeklySchedule){

    };

    protected filterAppointmentFields(appointment : Appointment) : Appointment{

    };

    protected abstract filterProfileData(user : UserProfile) : UserProfile;
}