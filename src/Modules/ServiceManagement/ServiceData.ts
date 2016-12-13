/**
 * 
 * 
 * 
 */
import { mongoose } from './../../Services/Database';

export interface ServiceItemData {
    name: string;
    price: number;
    time: number;
}

export interface ServiceGroupData {
    description: string;
    name: string;
    salon_id: string;
    service_list?: [ServiceItemData];
}

export interface IServiceGroupData extends ServiceGroupData, mongoose.Document { }
export interface IServiceItemData extends ServiceItemData, mongoose.Document { }
