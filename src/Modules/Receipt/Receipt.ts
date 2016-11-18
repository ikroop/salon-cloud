/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ReceiptItemData, ReceiptData } from './ReceiptData';

export class Receipt {
    private data: ReceiptData;
    constructor() {
        this.data.total = 0;
        this.data.payment_id = undefined;
    }

    /**
     * @name: add
     * @parameter: 
     *     item: ReceiptItemData
     * @return: True or False.
     * 
     */
    public add(item: ReceiptItemData): boolean {
        // Get Price of service
        // TODO:

        // Add item to 
        this.data.services.push(item);

        return true;
    }

    /**
     * Insert or Update receipt data
     * @name: save
     * @parameter: 
     *     None
     * @return: receipt Id.
     * 
     */
    public save(): string {
        // insert or update receipt to mongodb
        return this.data.id;
    }

    /**
     * Insert or Update receipt data
     * @name: save
     * @parameter: 
     *     None
     * @return: receipt Id.
     * 
     */
    public remove(receiptId:string){

    }

}