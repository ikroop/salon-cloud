/**
*
*
*
*/
import { mongoose } from './../../Services/Database';
import { Document } from 'mongoose';

export interface ScheduleItemData {
    close: number,
    open: number,
    status: boolean
};

export interface WeeklyDayData extends ScheduleItemData {
    day_of_week: number
};

export interface DailyDayData extends ScheduleItemData {
    date: Date
};

interface WeeklyScheduleData {
    salon_id: string, //<salon_id>
    employee_id: string,
    week: [WeeklyDayData]
};

interface DailyScheduleData {
    salon_id: string,
    employee_id: string,
    day: DailyDayData
};

export interface MonthlyScheduleData {
    salon_id: string, //<salon_id>
    employee_id: string,
    month: [DailyDayData]
}

export interface IWeeklyScheduleData extends WeeklyScheduleData, mongoose.Document { }
export interface IDailyScheduleData extends DailyScheduleData, mongoose.Document { }