//
//
//
//
//
//
import { DailyScheduleProfile } from './models/DailyScheduleModel';
import { WeeklyScheduleProfile } from './models/WeeklyScheduleModel';

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