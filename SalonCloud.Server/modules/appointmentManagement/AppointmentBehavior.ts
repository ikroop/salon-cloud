/**
 * 
 * 
 * 
 * 
 * 
 */
import { AppointmentData } from "./AppointmentData";

export interface AppointmentBehavior {
    cancelAppointment(appointmentId : string);
    createAppointment(appointment : AppointmentData);
    updateAppointment(appointmentId : string, appointment : AppointmentData);
    updateAppointmentStatus(appointmentId : string, status : number);
}