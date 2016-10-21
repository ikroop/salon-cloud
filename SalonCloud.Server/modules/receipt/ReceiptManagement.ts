/**
 * 
 * 
 * 
 * 
 * 
 */

import { ReceiptManagementBehavior } from './ReceiptManagementBehavior';
import { ReceiptData } from './ReceiptData';

export class ReceiptManagement implements ReceiptManagementBehavior {
    private salonId: string;

    constructor(salonId: string) {
        this.salonId = salonId;
    }

    
    public add(receipt: ReceiptData) {

    }
    public remove(receiptId: string) {

    }
    public update(receiptId: string, receipt: ReceiptData) {

    }
    public get(receiptId: string) {

    }
}