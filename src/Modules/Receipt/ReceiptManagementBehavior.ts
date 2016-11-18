/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ReceiptData } from './ReceiptData';

export interface ReceiptManagementBehavior {
    add(receipt: ReceiptData);
    remove(receiptId: string);
    update(receiptId: string, receipt: ReceiptData);
    get(receiptId: string);
}