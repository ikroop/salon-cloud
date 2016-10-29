

import {SalonUser} from './SalonUser'
import {CustomerBehavior} from './CustomerBehavior'
import {OnlineBooking} from './OnlineBooking'
import {BookingAppointmentBehavior} from './BookingAppointmentBehavior'

export class Customer extends SalonUser implements CustomerBehavior, OnlineBooking{
    
    bookingAppointmentDP: BookingAppointmentBehavior;
    
    public disableSubscription(){

    };

    public enableSubscription(){

    };
}