

import { IAppointmentData } from './AppointmentData';
import { mongoose } from '../../Services/Database';
import { SalonTimeSchema } from '../../Core/SalonTime/SalonTimeSchema'

const BookedServiceSchema = new mongoose.Schema({
    service_id: {type: String, require: true},
    service_name: {type: String, require: true},
    price: {type: Number, require: true},
    time: { type: Number, require: true}
})

const AppointmentItemSchema = new mongoose.Schema({
    start: { type: SalonTimeSchema, require: true},
    end: { type: SalonTimeSchema, require: true},
    employee_id: { type: String, require: true},
    servie: BookedServiceSchema,
    overlapped: { 
        status: {type: Boolean, require: true},
        overlapped_appointment_id: String
    },
})

const AppointmentSchema = new mongoose.Schema({
    customer_id: { type: String, require: true },
    device: { type: Number, require: true },
    appointment_items: [AppointmentItemSchema],
    payment_id: String,
    total: Number,
    salon_id: { type: String, require: true },
    status: { type: Number, require: true },
    is_reminded: { type: Boolean, require: true },
    note: String,
    type: { type: Number, require: true }
},
    {
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

var AppointmentModel = mongoose.model<IAppointmentData>('Appointment', AppointmentSchema);
export = AppointmentModel;
