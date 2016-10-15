/**
 * 
 * 
 * 
 */

import {AppointmentAbstract} from './AppointmentAbstract'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'
import {AppointmentBehavior} from './AppointmentBehavior'

export class CheckinAppointment implements AppointmentBehavior {

    public cancelAppointment(appointmentId : string) : boolean{
        return;
    }

    public createAppointment(appointment : AppointmentData) : boolean{
        return;
    }

    public updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean{
        return;
    }

    public updateAppointmentStatus(appointmentId : string, status : number) : boolean{
        return;
    }
  
}