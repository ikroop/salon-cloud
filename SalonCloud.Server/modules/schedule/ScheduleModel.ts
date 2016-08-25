//
//
//
//
//
//
import { DailyScheduleProfile } from './models/DailyScheduleProfile';
import { WeeklyScheduleProfile } from './models/WeeklyScheduleProfile';

export interface ScheduleProfile{
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