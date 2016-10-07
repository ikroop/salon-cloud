/**
 * 
 * 
 */
import { mongoose } from "../../services/database";
import {SalonData} from './SalonData';

export const SalonProfileSchema = new mongoose.Schema({
    _id: String,
    setting: {
        appointment_reminder: { type: Boolean, required: true },
        flexible_time: { type: Number, required: true },
        technician_checkout: { type: Boolean, required: true }
    },
    information: {
        salon_name: { type: String, required: true },
        phone: {
            number: { type: String, required: true },
            is_verified: { type: Boolean, required: true }
        },
        location: {
            address: { type: String, required: true },
            is_verified: { type: Boolean, required: true }
        },
        email: String
    }
});

export const SalonModel = mongoose.model<SalonData>('salon', SalonProfileSchema);