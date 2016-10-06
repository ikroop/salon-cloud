

import {BookingAppointmentBehavior} from './BookingAppointmentBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {Authorization} from './../authorization/Authorization'
import {SalonPublicService} from './../salonPublicService/SalonPublicService'

export interface AnonymousBehavior {
   
    auth: Authorization;

    salonPublicDP: SalonPublicService;

    forgotPassword(username) : SalonCloudResponse<boolean>;

    signInWithUserAndPassword(user : string, password : string) : SalonCloudResponse<boolean>;

    signUpWithUserAndPassword(username : string, password : string) : SalonCloudResponse<boolean>;
}