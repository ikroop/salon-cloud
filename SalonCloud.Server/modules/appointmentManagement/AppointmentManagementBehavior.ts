

import {AppointmentData} from './AppointmentData'

export interface AppointmentManagementBehavior {

    cancelAppointment(appointmentId : string) : boolean;

    createAppointment(appointment : AppointmentData) : string;

    getAppointment(appointmentId : string) : AppointmentData;

    getAppointmentByCustomer(customerId : string) : Array<AppointmentData>;

    getAppointmentByDate(date : Date) : Array<AppointmentData>;

    updateAppointment(appointmentId : string, appointment : AppointmentData) : boolean;

}