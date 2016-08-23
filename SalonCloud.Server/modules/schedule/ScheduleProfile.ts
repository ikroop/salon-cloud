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