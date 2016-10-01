

import {AnonymousBehavior} from './AnonymousBehavior';
import {OnlineBooking} from './OnlineBooking'
import {BookingAppointmentBehavior} from './BookingAppointmentBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {Authorization} from './../authorization/Authorization'

export class Anonymous implements AnonymousBehavior, OnlineBooking {

    auth: Authorization;

    salonPublicDP: SalonPublic;

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