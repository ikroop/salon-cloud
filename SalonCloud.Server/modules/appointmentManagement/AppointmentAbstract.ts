/**
 * 
 * 
 * 
 * 
 */

import { AppointmentManagement } from './AppointmentManagement'
import { AppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { AppointmentBehavior } from './AppointmentBehavior';

export abstract class AppointmentAbstract implements AppointmentBehavior {
    private appointmentManagementDP: AppointmentManagement;

    public cancelAppointment(appointmentId: string) {
        return;
    };

    public createAppointment(appointment: AppointmentData) {
        var validationResult = this.validation(appointment);

        //Normalization Data
        appointment = this.normalizationData(appointment);

        // Create appointment document
        var result = this.createAppointmentDoc(appointment);
        return result;
    };

    public updateAppointment(appointmentId: string, appointment: AppointmentData) {
        return;
    };

    public updateAppointmentStatus(appointmentId: string, status: number) {
        return
    };

    public checkBookingAvailableTimes(appointment: AppointmentData) {

        return;
    }

    private createAppointmentDoc(appointment: AppointmentData) {

    }



    protected abstract validation(appointment: AppointmentData): SalonCloudResponse<string>;
    protected abstract normalizationData(appointment: AppointmentData): AppointmentData;


}