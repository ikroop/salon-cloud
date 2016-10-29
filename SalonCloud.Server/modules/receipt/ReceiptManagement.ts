/**
 * 
 * 
 * 
 * 
 * 
 */

import { ReceiptManagementBehavior } from './ReceiptManagementBehavior';
import { ReceiptData, ReceiptItemData } from './ReceiptData';
import ReceiptModel = require ('./ReceiptModel');
import {SalonCloudResponse} from './../../core/SalonCloudResponse';

export class ReceiptManagement implements ReceiptManagementBehavior {
    private salonId: string;

    constructor(salonId: string) {
        this.salonId = salonId;
    }

    
    public async add(receipt: ReceiptData) : Promise<SalonCloudResponse<ReceiptData>> {
        var response : SalonCloudResponse<ReceiptData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var newReceipt : ReceiptData = {
            total: receipt.total,
            services: receipt.services,
            payment_id: receipt.payment_id
        }

        var receiptCreation = ReceiptModel.create(newReceipt);
        await receiptCreation.then(function(docs){
            response.data = docs;
            response.code = 200;
        }, function(err){
            response.err = err;
            response.code = 500;
        });
        return response;
    }
    public remove(receiptId: string) {

    }
    public update(receiptId: string, receipt: ReceiptData) {

    }
    public get(receiptId: string) {

    }
}