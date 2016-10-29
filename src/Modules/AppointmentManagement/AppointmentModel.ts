

import { IAppointmentData } from './AppointmentData';
import { mongoose } from '../../Services/Database';


const AppointmentSchema = new mongoose.Schema({
    customer_id: { type: String, require: true },
    device: { type: Number, require: true },
    overlapped: { 
        status: {type: Boolean, require: true},
        overlapped_appointment_id: String
    },
    is_reminded: { type: Boolean, require: true },
    note: String,
    receipt_id: { type: String, require: true },
    salon_id: { type: String, require: true },
    status: { type: Number, require: true },
    type: { type: Number, require: true }
});

var AppointmentModel = mongoose.model<IAppointmentData>('Appointment', AppointmentSchema);
export = AppointmentModel;
