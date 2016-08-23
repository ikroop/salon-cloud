//
//
//
//
import {SalonProfile} from './SalonProfile';
import {User} from './../User/User';
import * as mongoose from "mongoose";
export const SalonProfileSchema = new mongoose.Schema({
    setting:{
        appointment_reminder: { type: Boolean, required: true },
        flexible_time: { type: Number, required: true },
        technician_checkout: { type: Boolean, required: true }
    },
    information:{
        salon_name: { type: String, required: true },
        phone:{
            number:{ type: String, required: true },
            is_verified: { type: Boolean, required: true }
        },
        location:{
            address: { type: String, required: true },
            is_verified: { type: Boolean, required: true }
        }, 
        email: String
    }
});

export const SalonProfileModel = mongoose.model<SalonProfile>('Salon', SalonProfileSchema);

export class Salon {
    private UserId:string;
    private SalonId:string;
    constructor(UserId: string) {
        this.UserId = UserId;
    }
    createSalonInformation(SalonProfileData: SalonProfile, callback) {
        //create salon object in database
        SalonProfileModel.create(SalonProfileData, (err: any, salon: SalonProfile) => {
            if (err) {
                callback(null);
            } else {
                this.SalonId = salon._id;
                var user = new User(this.SalonId, this.UserId);
                user.createProfile({
                    "salon_id": this.SalonId,
                    "role": User.SALON_OWNER_ROLE,
                    "status": true
                }, function(data){

                });
                callback(salon);
            }
        });
    }
}