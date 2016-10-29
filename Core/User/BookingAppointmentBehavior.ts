
import { SalonCloudResponse } from './../SalonCloudResponse'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { AppointmentManagement } from './../../Modules/AppointmentManagement/AppointmentManagement'
import { ServiceManagement } from './../../Modules/ServiceManagement/ServiceManagement'
import { ServiceItemData } from './../../Modules/ServiceManagement/ServiceData'

export interface BookingAppointmentBehavior {

    appointmentDP: AppointmentManagement;
    serviceDP: ServiceManagement;
    //VerificationDP: Verification;

    bookAppointment(appointment: AppointmentData): SalonCloudResponse<AppointmentData>;

    getAvailableTime(date: Date, services: Array<ServiceItemData>): SalonCloudResponse<any>;

    getServices(): SalonCloudResponse<Array<ServiceItemData>>;

    sendVerifyCode(phonenumber: string): SalonCloudResponse<boolean>;

    verifyCode(code: string): SalonCloudResponse<boolean>;


}