//
//
//
//
import {SalonProfile} from './SalonProfile';
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
    createSalonInformation(SalonProfileData: SalonProfile, callback) {

        console.log('SalonProfileData:', SalonProfileData);
        //create salon object in database
        SalonProfileModel.create(SalonProfileData, (err: any, salon: SalonProfile) => {
            if (err) {
                callback(null);
            } else {
                callback(salon);
            }
        });
    }
}