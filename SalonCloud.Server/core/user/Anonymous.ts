

import {AnonymousBehavior} from './AnonymousBehavior';
import {OnlineBooking} from './OnlineBooking'
import {BookingAppointmentBehavior} from './BookingAppointmentBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {Authorization} from './../authorization/Authorization'
import {SalonPublicService} from './../salonPublicService/SalonPublicService'

export class Anonymous implements AnonymousBehavior, OnlineBooking {

    auth: Authorization;

    salonPublicDP: SalonPublicService;

    bookingAppointmentDP: BookingAppointmentBehavior;

    forgotPassword(username) : SalonCloudResponse<boolean>{

        return;

    };

    signInWithUserAndPassword(user : string, password : string) : SalonCloudResponse<boolean>{

        return;
    };

    signUpWithUserAndPassword(username : string, password : string) : SalonCloudResponse<boolean>{

        return;
    };
    
}