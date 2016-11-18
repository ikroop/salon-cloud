/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { mongoose } from './../../Services/Database';
import { IReceiptData } from './ReceiptData';


const ReceiptItemSchema = new mongoose.Schema({
    employee_id: {type: String, require: true},
    price: {type: Number, require: true},
    service_group_id: {type: String, require: true},
    service_id: {type: String, require: true}
});

const ReceiptSchema = new mongoose.Schema({
    services: [ReceiptItemSchema],
    payment_id: String,
    total: Number,
});

var ReceiptModel = mongoose.model<IReceiptData>('Receipt', ReceiptSchema);
export = ReceiptModel;