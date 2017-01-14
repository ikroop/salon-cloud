/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { mongoose } from './../../Services/Database';
import { FirebaseDocument } from './../../Services/FirebaseDocument';

export interface ServiceItemData {
    name: string;
    price: number;
    time: number;
}

export interface ServiceGroupData {
    description: string;
    name: string;
    salon_id: string;
    service_list?: ServiceItemData[];
}

export interface IServiceGroupData extends ServiceGroupData, mongoose.Document { 
    service_list?: IServiceItemData[]
}

export interface IServiceItemData extends ServiceItemData, FirebaseDocument{};//mongoose.Document { }
