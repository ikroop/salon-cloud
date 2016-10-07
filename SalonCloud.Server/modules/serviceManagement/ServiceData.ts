/**
 * 
 * 
 * 
 */

export interface ServiceItemData {
    id?: string;
    name: string;
    price: number;
    time: number;
}

export interface ServiceGroupData {
    description?: string;
    id?: string;
    name: string;
    salon_id: string;
    service_list?: [ServiceItemData];
}