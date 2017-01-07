/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { mongoose } from './../../Services/Database';
import { Document } from 'mongoose';

export interface SalonTimeData {
    min: number;
    hour: number;
    day: number;
    month: number;
    year: number;
    timestamp?: number;
}