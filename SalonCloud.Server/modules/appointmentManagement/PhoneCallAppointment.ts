

import {AppointmentAbstract} from './AppointmentAbstract'
import {AppointmentData} from './AppointmentData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'

export class PhoneCallAppointment extends AppointmentAbstract {

    protected validation(appointment : AppointmentData) : SalonCloudResponse<string>{
        return;
    };
}