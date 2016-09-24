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
import {SalonSchedule} from "./SalonSchedule"
var ErrorMessage = require  ("../../core/ErrorMessage");
export class EmployeeSchedule extends Schedule {

    constructor (salonId: string, employeeId: string){
        super(salonId, employeeId);
    }

    /**
     * normalizeDailySchedule
	 * If Salon has no schedule for a date --> Employee has no schedule on that date too
     * Employee.DailySchedule(date).open >= Salon.DailySchedule(date).open
     * Employee.DailySchedule(date).close <= Salon.DailySchedule(date).close
     */
    protected async normalizeDailySchedule(dailySchedule: DailyDayData){
        //Todo: implementation >>> compare with salon to get the best schedule
        var employeeDailyScheduleData = dailySchedule;

        var resultReturn: DailyDayData;
        
        let salonSchedule = new SalonSchedule(this.salonId);
        let promiseSalonDailyScheduleData = await salonSchedule.getDailySchedule(dailySchedule.date);
        let salonDailyScheduleData = promiseSalonDailyScheduleData.data;

        if (salonDailyScheduleData) {
            
            if (employeeDailyScheduleData.open < salonDailyScheduleData.day.open) {
                employeeDailyScheduleData.open = salonDailyScheduleData.day.open;
            }

            if (employeeDailyScheduleData.close > salonDailyScheduleData.day.close) {
                employeeDailyScheduleData.close = salonDailyScheduleData.day.open;
            }
        } else {
            employeeDailyScheduleData = null;
        }


        return employeeDailyScheduleData;
    }

    protected normalizeWeeklySchedule(WeeklySchedule: [WeeklyDayData]){
        //Need to use async/await
        //Todo: implementation >>>> compare with salon to get the best schedules
        //Step 1: get salon's [WeeklyDayData] (look at getWeeklyScheduleRecord() in parent class for similar implementation);
        //Step 2: loop through each day in array, logically choose the best schedule for that day;
        //      ex: On that day, employee schedule status is 'open' but salon schedule status is 'close', we choose 'close'
        //          On that day, operation time is 10am-6pm for employee but 11am-8pm for salon, we choose '11am-6pm'
        //          (There are many cases, try to catch all)
        //Step 3: return the resulted array<WeeklyDayData>
        return WeeklySchedule;
    };

}