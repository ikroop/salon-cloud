/**
 * 
 * 
 * 
 */
import { mongoose } from '../../Services/Database';

export interface BookedServiceData {
    service_id: string,
    service_name: string,
    price: number,
    time: number
}
export interface AppointmentItemData {
    employee_id: string,
    start: number,
    end: number,
    services: [BookedServiceData],
    overlapped: {
        status: boolean;
        overlapped_appointment_id?: string;
    };
    id?: string;
}

export interface AppointmentData{
    id?: string,
    appointment: [AppointmentItemData],
    total: number,
    payment_id: string,
    device: number,
    is_reminded: boolean,
    salon_id: string,
    status: number,
    type: number,
    customer_id: string,
    comment: string,
}

export interface IAppointmentData extends AppointmentData, mongoose.Document { };