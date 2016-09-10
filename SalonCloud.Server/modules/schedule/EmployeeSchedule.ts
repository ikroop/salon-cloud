/**
 * 
 * 
 */
<<<<<<< HEAD
import { ScheduleBehavior } from './ScheduleBehavior';
import {DailyScheduleModel} from './ScheduleModel';
// import {WeeklyScheduleModel, WeeklyScheduleProfile} from './ScheduleModel';
import {DailyScheduleData} from './ScheduleData';
import {WeeklyScheduleData} from './ScheduleData';
import * as mongoose from "mongoose";
=======
import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
export class EmployeeSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
>>>>>>> origin/master

    protected addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean {
        return false;
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

<<<<<<< HEAD
    /**
     * name
     */
    public insertWeekly(salonId: string, schedule: WeeklyScheduleData, callback) {
=======
    protected checkWeeklySchedule(): boolean {
        return false;
    }
>>>>>>> origin/master

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