/**
 * 
 * 
 * 
 */
import { mongoose } from './../../Services/Database';

export interface ReceiptItemData {
    employee_id: string,
    price: number,
    service_id: string
}

export interface ReceiptData {
    id?: string,
    services: [ReceiptItemData],
    total: number,
    payment_id: string
}

export interface IReceiptData extends ReceiptData, mongoose.Document { };