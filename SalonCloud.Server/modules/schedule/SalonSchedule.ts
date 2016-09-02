/**
 * 
 * 
 */
import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
export class SalonSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

    protected addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean {
        return false;
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

    protected checkWeeklySchedule(): boolean {
        return false;
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
        return false;
    }
}