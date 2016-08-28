//
//
//
//
//
//
import { DailyScheduleData } from './ScheduleData';
import { WeeklyScheduleData } from './ScheduleData';

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
    insertWeekly(salonId: string, schedule: WeeklyScheduleData, callback);

    /**
     * name
     */
    insertDaily(schedule: DailyScheduleData, callback);
    
}