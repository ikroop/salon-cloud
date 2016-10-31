/**
 * 
 * 
 */
import { mongoose } from './../../Services/Database';
import { ISalonModel } from './SalonData';

const SalonProfileSchema = new mongoose.Schema({
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
            is_verified: { type: Boolean, required: true },
            timezone_id: String
        },
        email: String
    }
});

let SalonModel; 
try {
  // Throws an error if 'Name' hasn't been registered
  SalonModel = mongoose.model('Salon')
} catch (e) {
  SalonModel = mongoose.model<ISalonModel>('Salon', SalonProfileSchema);
}

export = SalonModel;