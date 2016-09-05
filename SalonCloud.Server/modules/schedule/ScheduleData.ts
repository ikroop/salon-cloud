/**
*
*
*
*/
import { mongoose } from "../../services/database";
import { Document } from "mongoose";

export interface ScheduleItemData extends Document{
	_id: string,
	close: number,
	open: number,
	status: boolean
};

export interface WeeklyScheduleData extends ScheduleItemData{
    day_of_week: number
};

export interface DailyScheduleData extends ScheduleItemData{
    date: Date
};

export interface ScheduleData {
    _id: string, //<salon_id>
    salon:{
        weekly: [WeeklyScheduleData],
        daily: [DailyScheduleData]
    },
    employee:[{
        employee_id: string,
        weekly: [WeeklyScheduleData],
        daily: [DailyScheduleData]
    }]
};