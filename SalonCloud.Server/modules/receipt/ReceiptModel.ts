/**
 * 
 * 
 * 
 * 
 */

import { mongoose } from "../../services/database";
import { ReceiptData, ReceiptItemData } from './ReceiptData';

export const ReceiptItemSchema = new mongoose.Schema({
    employee_id: {type: String, require: true},
    price: {type: Number, require: true},
    service_group_id: {type: String, require: true},
    service_id: {type: String, require: true}
});

export const ReceiptSchema = new mongoose.Schema({
    services: [ReceiptItemSchema],
    payment_id: String,
    total: Number,
});

export const ReceiptModel = mongoose.model<ReceiptData>('Receipt', ReceiptSchema);