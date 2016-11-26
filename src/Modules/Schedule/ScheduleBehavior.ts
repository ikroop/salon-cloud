//
//
//
//
//
//
import { IDailyScheduleData, IWeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'

export interface ScheduleBehavior {
    /**
     * getDailySchedule
	 *
     */
    getDailySchedule(start: SalonTimeData, end: SalonTimeData);

    /**
     * name
     */
    getWeeklySchedule();



    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[]);

    /**
     * name
     */
    saveDailySchedule(dailySchedule: DailyDayData);

}