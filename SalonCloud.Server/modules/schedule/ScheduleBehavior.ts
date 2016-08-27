//
//
//
//
//
//
import { DailyScheduleData } from './models/ScheduleData';
import { WeeklyScheduleData } from './models/ScheduleData';

export interface ScheduleBehavior{
    /**
     * name
     */
    getSchedule(startDate: Date, endDate: Date, callback): [DailyScheduleData]; 

    /**
     * name
     */
    getWeeklySchedule(callback): [WeeklyScheduleData];

    /**
     * name
     */
    insertWeekly(schedule: WeeklyScheduleData, callback);

    /**
     * name
     */
    insertDaily(schedule: DailyScheduleData, callback);
    
}