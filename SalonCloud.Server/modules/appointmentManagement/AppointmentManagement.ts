


import {AppointmentManagementBehavior} from './AppointmentManagementBehavior'

export class AppointmentManagement implements AppointmentManagementBehavior {

    public salonId: string;

    public cancelAppointment(appointmentId : string) : boolean{

    };

    public createAppointment(appointment : AppointmentData) : string{

    };

    public getAppointment(appointmentId : string) : AppointmentData{

    };

    public getAppointmentByCustomer(customerId : string) : Array<AppointmentData>{

    };

    public getAppointmentByDate(date : Date) : Array<AppointmentData>{

    };

    public updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean{

    };


}
