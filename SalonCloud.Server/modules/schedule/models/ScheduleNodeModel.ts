//
//
//
//
//
//
/*import * as mongoose from "mongoose";
//import { DailyScheduleProfile, DailyScheduleSchema } from './models/DailyScheduleModel';
//import { WeeklyScheduleProfile, WeeklyScheduleSchema } from './models/WeeklyScheduleModel';

export interface ScheduleNodeProfile{
    salon: {
        salon_id: string,
        weekly: [WeeklyScheduleProfile],
        daily: [DailyScheduleProfile]
    },
    emplopyee: {
        employee_id: string,
        salon_id: string,
        weekly: [WeeklyScheduleProfile],
        daily: [DailyScheduleProfile]
    }
}

export const ScheduleNodeSchema = new mongoose.Schema({
    salon: {
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklyScheduleSchema], required: true },
        daily: { type: [DailyScheduleSchema], required: true }
    },
    emplopyee: {
        employee_id: { type: String, required: true },
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklyScheduleSchema], required: true },
        daily: { type: [DailyScheduleSchema], required: true }
    }
});

export const ScheduleNodeModel = mongoose.model('Schedule', ScheduleNodeSchema);
*/