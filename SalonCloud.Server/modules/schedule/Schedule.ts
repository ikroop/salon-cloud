/**
 * 
 * 
 */
import * as mongoose from "mongoose";
import {DailyScheduleSchema} from './models/DailySchedule';
import {WeeklyScheduleSchema} from './models/WeeklySchedule';

export const ScheduleProfileSchema = new mongoose.Schema({
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

export const ScheduleProfileModel = mongoose.model('Schedule', ScheduleProfileSchema);