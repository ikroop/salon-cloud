
import { SalonCloudResponse } from './../SalonCloudResponse'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { AppointmentManagement } from './../../modules/appointmentManagement/AppointmentManagement'
import { ServiceManagement } from './../../modules/serviceManagement/ServiceManagement'
import { ServiceItemData } from './../../modules/serviceManagement/ServiceData'

export interface BookingAppointmentBehavior {

    appointmentDP: AppointmentManagement;
    serviceDP: ServiceManagement;
    //verificationDP: Verification;

    bookAppointment(appointment: AppointmentData): SalonCloudResponse<AppointmentData>;

    getAvailableTime(date: Date, services: Array<ServiceItemData>): SalonCloudResponse<any>;

    getServices(): SalonCloudResponse<Array<ServiceItemData>>;

    sendVerifyCode(phonenumber: string): SalonCloudResponse<boolean>;

    verifyCode(code: string): SalonCloudResponse<boolean>;


}