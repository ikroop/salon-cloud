/**
 * 
 * 
 */

import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
import { ScheduleModel } from "./ScheduleModel";
export class SalonSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }


    protected addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean{
        return true;
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
    protected checkWeeklySchedule(salonId: String): boolean{
        return true;
    }

    protected getDailyScheduleRecord(date: Date): DailyScheduleData {
        var dailySchedule: DailyScheduleData;
        return dailySchedule;
    }

    protected getWeeklyScheduleRecord(): [WeeklyScheduleData] {
        var weeklyScheduleList: [WeeklyScheduleData];

        return weeklyScheduleList;
    }

    protected normalizeDailySchedule(dailySchedule: DailyScheduleData): DailyScheduleData {
        return dailySchedule;
    }

    protected updateDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
    
    protected updateWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean {
        return true;
    }
}