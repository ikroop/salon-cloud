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

    public async createAppointment(appointment: AppointmentData) : Promise<SalonCloudResponse<AppointmentData>> {
        var response : SalonCloudResponse<AppointmentData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        
        var validationResult = this.validation(appointment);

        //Normalization Data
        var newAppointment = this.normalizationData(appointment);

        // Create appointment document
        //var result = this.createAppointmentDoc(appointment);

        var result = await this.appointmentManagementDP.createAppointment(newAppointment);
        if(result.err){
            response.err = result.err;
            response.code = result.code;
            return response;
        }

        return response;
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