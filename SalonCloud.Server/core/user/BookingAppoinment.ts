

import {BookingAppointmentBehavior} from './BookingAppointmentBehavior';
import {SalonCloudResponse} from './../SalonCloudResponse'
import {AppointmentData} from './../../modules/appointmentManagement/AppointmentData'
import {AppointmentManagement} from './../../modules/appointmentManagement/AppointmentManagement'
import {ServiceManagement} from './../../modules/serviceManagement/ServiceManagement'
import {ServiceItem} from './../../modules/serviceManagement/ServiceItem'
import {Verification} from './../verification/Verification'


export class BookingAppointment implements BookingAppointmentBehavior {

    appointmentDP: AppointmentManagement;
    serviceDP: ServiceManagement;
    verificationDP: Verification;

    bookAppointment(appointment : AppointmentData) : SalonCloudResponse<AppointmentData>{

        return;
    };
    
    getAvailableTime(date : Date, services : Array<ServiceItem>) : SalonCloudResponse<BookingSchedule>{

        return;
    };

    getServices() : SalonCloudResponse<Array<ServiceItem>>{

        return;
    };

    sendVerifyCode(phonenumber : string) : SalonCloudResponse<boolean>{

        return;
    };

    verifyCode(code : string) : SalonCloudResponse<boolean>{

        return;
    };


}