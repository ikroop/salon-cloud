/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import {AbstractEmployee} from './AbstractEmployee' 
import {AppointmentData} from './../../Modules/AppointmentManagement/AppointmentData'


export class Technician extends AbstractEmployee {
    
    protected filterAppointmentFields(appointment : AppointmentData) : AppointmentData{
        return;
    };

}