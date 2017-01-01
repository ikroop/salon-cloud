/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { WeeklyDayData, DailyDayData } from './../../Modules/Schedule/ScheduleData'

export interface ScheduleManagementDatabaseInterface<DailySchedule, WeeklySchedule> {
    getWeeklySchedule(employeeId: string): Promise<WeeklySchedule>;
    updateWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<WeeklySchedule>;
    saveWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<WeeklySchedule>;
}