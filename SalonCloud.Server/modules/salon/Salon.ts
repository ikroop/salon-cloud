//
//
//
//
import {ISalon} from './ISalon';
import * as mongoose from "mongoose";

export const SalonSchema = new mongoose.Schema({
    salon_name: { type: String, required: true },
    address: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: String
});

export const SalonModel = mongoose.model<ISalon>('Salon', SalonSchema);

export class Salon {
    CreateSalonInformation(salonData: ISalon, callback) {

        //create salon object in database
        SalonModel.create(salonData, (err: any, salon: ISalon) => {
            if (err) {
                callback(null);
            } else {
                callback(salon);
            }
        });



    }
}