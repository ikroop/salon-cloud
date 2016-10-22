

import { AppointmentData } from './AppointmentData';
import { mongoose } from '../../services/database';


export const AppointmentSchema = new mongoose.Schema({
    customer_id: { type: String, require: true },
    device: { type: Number, require: true },
    flexible: { type: Boolean, require: true },
    is_reminded: { type: Boolean, require: true },
    note: String,
    receipt_id: { type: String, require: true },
    salon_id: { type: String, require: true },
    status: { type: Number, require: true },
    type: { type: Number, require: true }
});

export const AppointmentModel = mongoose.model<AppointmentData>('Appointment', AppointmentSchema);
