

import {AppointmentManagement} from './AppointmentManagement'

export abstract class AppointmentAbstract {
    private appointmentManagementDP: AppointmentManagement;

    public cancelAppointment(appointmentId : string) : boolean{

    };

    public createAppointment(appointment : AppointmentData) : string{

    };

    public updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean{

    };

    public updateAppointmentStatus(status : number) : boolean{

    };

    protected abstract validation(appointment : AppointmentData) : SalonCloudResponse<string>;

}