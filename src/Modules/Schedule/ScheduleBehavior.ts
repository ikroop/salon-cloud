//
//
//
//
//
//
import { IDailyScheduleData, IWeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import {SalonCloudResponse} from './../../Core/SalonCloudResponse';

export interface ScheduleBehavior{
    /**
     * getDailySchedule
	 *
     */
    getDailySchedule(date: Date);

    /**
     * name
     */
    getWeeklySchedule();
	
	/**
	*
	*/
	getMonthlySchedule(month: number, year: number);
	

    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData]);

    /**
     * name
     */
    saveDailySchedule(dailySchedule: DailyDayData);
    
}