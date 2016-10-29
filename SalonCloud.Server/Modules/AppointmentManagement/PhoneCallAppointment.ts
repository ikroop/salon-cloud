/**
 * 
 * 
 * 
 */

import {AppointmentAbstract} from './AppointmentAbstract'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../Core/SalonCloudResponse'

export class PhoneCallAppointment extends AppointmentAbstract {

    protected validation(appointment : AppointmentData) : SalonCloudResponse<string>{
        return;
    }

    protected normalizationData(appointment: AppointmentData): AppointmentData{

        return;
    }
}