


import {AbstractEmployee} from './AbstractEmployee' 
import {AppointmentData} from './../../modules/appointmentManagement/AppointmentData'


export class Technician extends AbstractEmployee {
    
    protected filterAppointmentFields(appointment : AppointmentData) : AppointmentData{
        return;
    };

}