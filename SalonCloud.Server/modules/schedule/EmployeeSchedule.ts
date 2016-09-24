/**
 * 
 * 
 */
import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { ScheduleItemData, DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from "./ScheduleData";
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
     * Compare with salon to get the best schedule
	 * If Salon has no schedule for a date --> Employee has no schedule on that date too
     * If Salon OFF --> Employee OFF
     * Employee.DailySchedule(date).open >= Salon.DailySchedule(date).open
     * Employee.DailySchedule(date).close <= Salon.DailySchedule(date).close
     * @param {DailyDayData} dailySchedule: DailyDayData of employee
     * @returns {DailyDayData}
     */
    protected async normalizeDailySchedule(dailySchedule: DailyDayData){
        //Todo: implementation >>> compare with salon to get the best schedule
        var employeeDailyDayData = dailySchedule;
        
        let salonSchedule = new SalonSchedule(this.salonId);
        let promiseSalonDailyScheduleData = await salonSchedule.getDailySchedule(dailySchedule.date);
        let salonDailyScheduleData = promiseSalonDailyScheduleData.data;

        if (salonDailyScheduleData) {
            employeeDailyDayData = this.updateDailyDayDataAccordingToSalon(employeeDailyDayData, salonDailyScheduleData.day);
        } else {
            employeeDailyDayData = null;
        }


        return employeeDailyDayData;
    }

    /**
     * normalizeWeeklySchedule
     * Compare with salon to get the best schedules
	 * If Salon has no schedule for a date --> Employee has no schedule on that date too
     * If Salon OFF --> Employee OFF
     * Employee.DailySchedule(date).open >= Salon.DailySchedule(date).open
     * Employee.DailySchedule(date).close <= Salon.DailySchedule(date).close
     * @param {[WeeklyDayData]} WeeklySchedule: array of WeeklyDayDatas of employee
     * @returns {[WeeklyDayData]}
     */
    protected async normalizeWeeklySchedule(WeeklySchedule: [WeeklyDayData]){
        //Need to use async/await
        //Todo: implementation >>>> compare with salon to get the best schedules
        //Step 1: get salon's [WeeklyDayData] (look at getWeeklyScheduleRecord() in parent class for similar implementation);
        //Step 2: loop through each day in array, logically choose the best schedule for that day;
        //      ex: On that day, employee schedule status is 'open' but salon schedule status is 'close', we choose 'close'
        //          On that day, operation time is 10am-6pm for employee but 11am-8pm for salon, we choose '11am-6pm'
        //          (There are many cases, try to catch all)
        //Step 3: return the resulted array<WeeklyDayData>

        // Sort [WeekyDayData] of employee, ascending = true
        let asc = true;
        var employeeWeeklyDayDataArray = this.sortWeeklyDayDataArray(WeeklySchedule, asc);
        
        let salonSchedule = new SalonSchedule(this.salonId);
        let promiseSalonWeeklyScheduleData = await salonSchedule.getWeeklySchedule();
        let salonWeeklyScheduleData = promiseSalonWeeklyScheduleData.data;

        if (salonWeeklyScheduleData) {
            // Sort [WeekyDayData] of salon, ascending = true
            let salonWeeklyDayDataArray = this.sortWeeklyDayDataArray(salonWeeklyScheduleData.week, asc);

            for (var i = 0; i < employeeWeeklyDayDataArray.length; i++) {
                var employeeWeeklyDayData = employeeWeeklyDayDataArray[i];
                var salonWeeklyDayData = salonWeeklyDayDataArray[i];

                employeeWeeklyDayData = this.updateDailyDayDataAccordingToSalon(employeeWeeklyDayData, salonWeeklyDayData);
            }
        } else {
            employeeWeeklyDayDataArray = null;
        }

        return employeeWeeklyDayDataArray;
    };

    /**
     * updateDailyDayDataAccordingToSalon
     * Compares Employee's ScheduleItemData with correspond salon's one to get the best schedule
     * If Employee
	 * If Salon has no schedule for a date --> Employee has no schedule on that date too
     * If Salon OFF --> Employee OFF
     * If Employee.DailySchedule(date).open < Salon.DailySchedule(date).open, must re-assign Employee.DailySchedule(date).open = Salon.DailySchedule(date).open
     * If Employee.DailySchedule(date).close > Salon.DailySchedule(date).close, must re-assign Employee.DailySchedule(date).close = Salon.DailySchedule(date).close
     * @param {<T extends ScheduleItemData>} employeeDayData: ScheduleItemData of employee
     * @param {<T extends ScheduleItemData>} salonDayData: ScheduleItemData of salon
     * @returns {<T extends ScheduleItemData>}
     */
    private updateDailyDayDataAccordingToSalon<T extends ScheduleItemData>(employeeDayData: T, salonDayData: T) {

        if (employeeDayData.close < salonDayData.open) {
            employeeDayData.status = false;
            return employeeDayData;
        }

        if (employeeDayData.open > salonDayData.close) {
            employeeDayData.status = false;
            return employeeDayData;
        }

        if (salonDayData.status == false) {
            employeeDayData.status = false;
        }
        
        if (employeeDayData.open < salonDayData.open) {
            employeeDayData.open = salonDayData.open;
        }

        if (employeeDayData.close > salonDayData.close) {
            employeeDayData.close = salonDayData.close;
        }

        return employeeDayData;
    }
}