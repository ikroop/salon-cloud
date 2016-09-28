

import {AnonymousBehavior} from './AnonymousBehavior';
import {OnlineBooking} from './OnlineBooking'
import {BookingAppointmentBehavior} from './BookingAppointmentBehavior'

export class Anonymous implements AnonymousBehavior, OnlineBooking {

    auth: Authorization;

    salonPublicDP: SalonPublic;

    bookingAppointmentDP: BookingAppointmentBehavior;

    forgotPassword(username) : SalonCloudResponse<boolean>{

    };

    signInWithUserAndPassword(user : string, password : string) : SalonCloudResponse<boolean>{

    };

    signUpWithUserAndPassword(username : string, password : string) : SalonCloudResponse<boolean>{

    };
    
}