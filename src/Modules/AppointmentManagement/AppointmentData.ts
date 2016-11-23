/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { mongoose } from '../../Services/Database';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'

export interface BookedServiceData {
    service_id: string,
    service_name: string,
    price: number,
    time: number
}
export interface AppointmentItemData {
    employee_id: string,
    start: SalonTimeData,
    end: SalonTimeData,
    service: BookedServiceData,
    overlapped: {
        status: boolean;
        overlapped_appointment_id?: string;
    };
}

export interface AppointmentData {
    id?: string,
    appointment_items: AppointmentItemData[],
    total: number,
    payment_id?: string,
    device: number,
    is_reminded: boolean,
    salon_id: string,
    status: number,
    type: number,
    customer_id: string,
    note: string,
}

export interface IAppointmentData extends AppointmentData, mongoose.Document { };