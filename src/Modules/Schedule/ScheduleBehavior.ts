//
//
//
//
//
//
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { DailyScheduleArrayData, IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData, DailyScheduleData } from './ScheduleData';

export interface ScheduleBehavior {

    /**
     * 
     * 
     * @param {SalonTimeData} start
     * @param {SalonTimeData} end
     * @returns {Promise<SalonCloudResponse<DailyScheduleArrayData>>}
     * 
     * @memberOf ScheduleBehavior
     */
    getDailySchedule(start: SalonTimeData, end: SalonTimeData): Promise<SalonCloudResponse<DailyScheduleArrayData>>;

    /**
     * 
     * 
     * @returns {Promise<SalonCloudResponse<WeeklyScheduleData>>}
     * 
     * @memberOf ScheduleBehavior
     */
    getWeeklySchedule(): Promise<SalonCloudResponse<WeeklyScheduleData>>;

    /**
     * 
     * 
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<SalonCloudResponse<any>>}
     * 
     * @memberOf ScheduleBehavior
     */
    saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<SalonCloudResponse<undefined>>;

    /**
     * 
     * 
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<SalonCloudResponse<any>>}
     * 
     * @memberOf ScheduleBehavior
     */
    saveDailySchedule(dailySchedule: DailyDayData): Promise<SalonCloudResponse<undefined>>;

}