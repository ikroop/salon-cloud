/**
 * 
 * 
 * 
 */

export interface ReceiptItemData{
    employee_id: string,
    price: number,
    service_id: string
}

export interface ReceiptData{
    id: string,
    services: [ReceiptItemData],
    total: number,
    payment_id: string
}