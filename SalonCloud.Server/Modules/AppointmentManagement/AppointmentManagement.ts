


import {AppointmentManagementBehavior} from './AppointmentManagementBehavior'
import {AppointmentData} from './AppointmentData'

export class AppointmentManagement implements AppointmentManagementBehavior {

    public salonId: string;

    public cancelAppointment(appointmentId : string) : boolean{
        return;
    };

    public createAppointment(appointment : AppointmentData) : string{
        return;
    };

    public getAppointment(appointmentId : string) : AppointmentData{
        return;
    };

    public getAppointmentByCustomer(customerId : string) : Array<AppointmentData>{
        return;
    };

    public getAppointmentByDate(date : Date) : Array<AppointmentData>{
        return;
    };

    public updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean{
        return;
    };


}
