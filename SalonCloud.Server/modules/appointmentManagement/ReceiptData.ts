

import {ReceiptItemData} from './ReceiptItemData'

export interface ReceiptData{

    id: string;
    service: Array<ReceiptData>;
    total: number;
}