/**
 * 
 * 
 * 
 */

import {AppointmentAbstract} from './AppointmentAbstract'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'

export class BookingAppointment extends AppointmentAbstract {

    public validation(appointment : AppointmentData) : SalonCloudResponse<string>{

        return;
    }

    protected normalizationData(appointment: AppointmentData): AppointmentData{

        return;
    }
}