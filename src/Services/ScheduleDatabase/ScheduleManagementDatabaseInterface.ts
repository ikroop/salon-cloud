/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { WeeklyDayData, DailyDayData } from './../../Modules/Schedule/ScheduleData'
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData';

export interface ScheduleManagementDatabaseInterface<DailySchedule, WeeklySchedule> {
    getWeeklySchedule(employeeId: string): Promise<WeeklySchedule>;
    updateWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<WeeklySchedule>;
    saveWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<WeeklySchedule>;
    getDailySchedule(employeeId: string, startDate: SalonTimeData, endDate: SalonTimeData): Promise<DailySchedule[]>
    updateDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<DailySchedule>;
    saveDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<DailySchedule>;
}