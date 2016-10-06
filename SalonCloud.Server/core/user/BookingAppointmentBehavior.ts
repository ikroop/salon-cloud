
import {BookingAppointmentBehavior} from './BookingAppointmentBehavior';
import {SalonCloudResponse} from './../SalonCloudResponse'
import {AppointmentData} from './../../modules/appointmentManagement/AppointmentData'
import {AppointmentManagement} from './../../modules/appointmentManagement/AppointmentManagement'
import {ServiceManagement} from './../../modules/serviceManagement/ServiceManagement'
import {ServiceItem} from './../../modules/serviceManagement/ServiceItem'

export interface BookingAppointmentBehavior {

    appointmentDP: AppointmentManagement;
    serviceDP: ServiceManagement;
    verificationDP: Verification;

    bookAppointment(appointment : AppointmentData) : SalonCloudResponse<AppointmentData>;
    
    getAvailableTime(date : Date, services : Array<ServiceItem>) : SalonCloudResponse<BookingSchedule>;

    getServices() : SalonCloudResponse<Array<ServiceItem>>;

    sendVerifyCode(phonenumber : string) : SalonCloudResponse<boolean>;

    verifyCode(code : string) : SalonCloudResponse<boolean>;


}