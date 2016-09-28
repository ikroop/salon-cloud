


import {SalonUser} from './SalonUser'
import {EmployeeBehavior} from './EmployeeBehavior'

export abstract class AbstractEmployee extends SalonUser implements EmployeeBehavior  {

    employeeScheduleDp : EmployeeSchedule;
    salonScheduleDp : SalonSchedule;

    public getAppointmentByDate(date : Date) : Array<Appointment>{

    };

    public getAppointmentById(appointmentId : string) : Appointment{

    };

    public getSalonSchedule(start : Date, end : Date) : SalonCloudResopnse<Array<DailySchedule>>{

    };

    public getSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailySchedule>>{

    };

    public updateAppointmentStatus(appointmentId : string, status : number) : SalonCloudResponse<Appointment>{

    };

    protected abstract filterAppointmentFields(appointment : Appointment) : Appointment;


}