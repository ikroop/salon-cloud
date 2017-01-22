/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { FirebaseDocument } from './../../Services/FirebaseDocument';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'

export interface BookedServiceData {
    service_id: string,
    service_name?: string,
    price?: number,
    time?: number
}
export interface AppointmentItemData {
    appointment_id?: string,
    employee_id: string,
    start: SalonTimeData,
    end?: SalonTimeData,
    service: BookedServiceData,
    overlapped: {
        status: boolean;
        overlapped_appointment_id?: string;
    };
}

export interface AppointmentData {
    id?: string,
    appointment_items: AppointmentItemData[],
    total?: number,
    payment_id?: string,
    device: number,
    is_reminded: boolean,
    salon_id: string,
    status: number,
    type: number,
    customer_id: string,
    note: string,
}

export interface SaveAppointmentData {
    note?: string,
    customer_phone: string,
    customer_name?: string,
    salon_id: string,
    services: AppointmentItemData[];
}

export interface IAppointmentData extends AppointmentData, FirebaseDocument { };