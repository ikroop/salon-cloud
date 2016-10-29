

import {BookingAppointmentBehavior} from './BookingAppointmentBehavior';
import {SalonCloudResponse} from './../SalonCloudResponse'
import {AppointmentData} from './../../Modules/AppointmentManagement/AppointmentData'
import {AppointmentManagement} from './../../Modules/AppointmentManagement/AppointmentManagement'
import {ServiceManagement} from './../../Modules/ServiceManagement/ServiceManagement'
import {ServiceItemData} from './../../Modules/ServiceManagement/ServiceData'
import {Verification} from './../Verification/Verification'


export class BookingAppointment implements BookingAppointmentBehavior {

    appointmentDP: AppointmentManagement;
    serviceDP: ServiceManagement;
    verificationDP: Verification;

    bookAppointment(appointment : AppointmentData) : SalonCloudResponse<AppointmentData>{

        return;
    };
    
    getAvailableTime(date : Date, services : Array<ServiceItemData>) : SalonCloudResponse<any>{

        return;
    };

    getServices() : SalonCloudResponse<Array<ServiceItemData>>{

        return;
    };

    sendVerifyCode(phonenumber : string) : SalonCloudResponse<boolean>{

        return;
    };

    verifyCode(code : string) : SalonCloudResponse<boolean>{

        return;
    };


}