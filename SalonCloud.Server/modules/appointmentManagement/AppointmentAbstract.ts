

import {AppointmentManagement} from './AppointmentManagement'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'


export abstract class AppointmentAbstract {
    private appointmentManagementDP: AppointmentManagement;

    public cancelAppointment(appointmentId : string) : boolean{
        return;
    };

    public createAppointment(appointment : AppointmentData) : string{
        return;
    };

    public updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean{
        return;
    };

    public updateAppointmentStatus(status : number) : boolean{
        return
    };

    protected abstract validation(appointment : AppointmentData) : SalonCloudResponse<string>;

}