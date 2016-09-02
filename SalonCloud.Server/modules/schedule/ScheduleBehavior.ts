//
//
//
//
//
//
import { DailyScheduleData, WeeklyScheduleData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";

export interface ScheduleBehavior{
    /**
     * getDailySchedule
	 *
     */
    getDailySchedule(date: Date): SalonCloudResponse<DailyScheduleData>;

    /**
     * name
     */
    getWeeklySchedule(): SalonCloudResponse<[WeeklyScheduleData]>;
	
	/**
	*
	*/
	getMonthlySchedule(month: number, year: number): SalonCloudResponse<[DailyScheduleData]>;
	

    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]) : SalonCloudResponse<boolean>;

    /**
     * name
     */
    saveDailySchedule(dailySchedule: DailyScheduleData): SalonCloudResponse<boolean>;
    
}