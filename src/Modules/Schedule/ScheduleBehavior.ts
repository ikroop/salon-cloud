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
    getDailySchedule(date: SalonTimeData);

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
    saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[]);

    /**
     * name
     */
    saveDailySchedule(dailySchedule: DailyDayData);

}