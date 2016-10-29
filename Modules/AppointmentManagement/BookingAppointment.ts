/**
 * 
 * 
 * 
 */

import {AppointmentAbstract} from './AppointmentAbstract'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../Core/SalonCloudResponse'

export class BookingAppointment extends AppointmentAbstract {

    public validation(appointment : AppointmentData) : SalonCloudResponse<string>{

        return;
    }

    protected normalizationData(appointment: AppointmentData): AppointmentData{
        appointment.is_reminded = false;
        appointment.overlapped.status = false;
        appointment.status = 1;
        appointment.type = 1;
        appointment.device = 1;
        return;
    }
}