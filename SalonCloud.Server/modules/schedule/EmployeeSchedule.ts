/**
 * 
 * 
 */
import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from "./ScheduleData";
import { WeeklyScheduleModel, DailyScheduleModel } from "./ScheduleModel";
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {BaseValidator} from "./../../core/validation/BaseValidator";
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
    from "./../../core/validation/ValidationDecorators";
var ErrorMessage = require  ("../../core/ErrorMessage");
export class EmployeeSchedule extends Schedule {

    constructor (salonId: string, employeeId: string){
        super(salonId, employeeId);
    }




    protected getDailyScheduleRecord(date: Date): DailyDayData {
        var dailySchedule: DailyDayData;
        return dailySchedule;
    }

    protected getWeeklyScheduleRecord(): [WeeklyDayData] {
        var weeklyScheduleList: [WeeklyDayData];

        return weeklyScheduleList;
    }

    protected normalizeDailySchedule(dailySchedule: DailyDayData): DailyDayData {
        return dailySchedule;
    }

}