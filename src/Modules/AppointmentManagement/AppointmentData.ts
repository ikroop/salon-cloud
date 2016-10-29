/**
 * 
 * 
 * 
 */
import { mongoose } from '../../Services/Database';

export interface AppointmentData {

    customer_id: string;
    device: number;
    overlapped: {
        status: boolean;
        overlapped_appointment_id?: string;
    };
    id?: string;
    is_reminded: boolean;
    note: string;
    receipt_id: string;
    salon_id: string;
    status: number;
    type: number;
}

export interface IAppointmentData extends AppointmentData, mongoose.Document { };