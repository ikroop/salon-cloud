/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { mongoose } from './../../Services/Database';
import { Document } from 'mongoose';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { FirebaseDocument } from './../../Services/FirebaseDocument';

export interface ScheduleItemData {
    close: number,
    open: number,
    status: boolean
};

export interface WeeklyDayData extends ScheduleItemData {
    day_of_week: number
};

export interface DailyDayData extends ScheduleItemData {
    date: SalonTimeData
};

export interface WeeklyScheduleData {
    salon_id: string, //<salon_id>
    employee_id: string,
    week: WeeklyDayData[]
};

export interface DailyScheduleData {
    salon_id: string,
    employee_id: string,
    day: DailyDayData
};

export interface DailyScheduleArrayData {
    salon_id: string, //<salon_id>
    employee_id: string,
    days: DailyDayData[]
}

export interface IWeeklyScheduleData extends WeeklyScheduleData, FirebaseDocument{};//mongoose.Document { }
export interface IDailyScheduleData extends DailyScheduleData, FirebaseDocument{};