//
//
//
//
//
//
import { DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";

export interface ScheduleBehavior{
    /**
     * getDailySchedule
	 *
     */
    getDailySchedule(date: Date): SalonCloudResponse<DailyDayData>;

    /**
     * name
     */
    getWeeklySchedule(): SalonCloudResponse<[WeeklyDayData]>;
	
	/**
	*
	*/
	getMonthlySchedule(month: number, year: number): SalonCloudResponse<[DailyDayData]>;
	

    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData]);

    /**
     * name
     */
    saveDailySchedule(dailySchedule: DailyDayData);
    
}