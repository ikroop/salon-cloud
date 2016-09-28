

import {BookingAppointmentBehavior} from './BookingAppointmentBehavior';

export class BookingAppointment implements BookingAppointmentBehavior {

    appointmentDP: AppoinmentManagement;
    serviceDP: ServiceManagement;
    verificationDP: Verification;

    bookAppointment(appointment : Appointment) : SalonCloudResponse<Appointment>;
    
    getAvailableTime(date : Date, services : Array<Services>) : SalonCloudResponse<BookingSchedule>;

    getServices() : SalonCloudResponse<Array<Services>>;

    sendVerifyCode(phonenumber : string) : SalonCloudResponse<boolean>;

    verifyCode(code : string) : SalonCloudResponse<boolean>;


}