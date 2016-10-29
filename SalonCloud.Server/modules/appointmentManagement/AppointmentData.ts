/**
 * 
 * 
 * 
 */
import { mongoose } from '../../services/database';

export interface AppointmentData {

    customer_id: string;
    device: number;
    flexible: boolean;
    id?: string;
    is_reminded: boolean;
    note: string;
    receipt_id: string;
    salon_id: string;
    status: number;
    type: number;
}

export interface IAppointmentData extends AppointmentData, mongoose.Document { };