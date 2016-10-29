/**
 * 
 * 
 */
import { mongoose } from './../../Services/Database';
import { Schedule } from './Schedule';
import { ScheduleItemData, IDailyScheduleData, IWeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import WeeklyScheduleModel = require('./WeeklyScheduleModel');
import DailyScheduleModel = require('./DailyScheduleModel');
import {SalonCloudResponse} from './../../Core/SalonCloudResponse';
import {BaseValidator} from './../../Core/Validation/BaseValidator';
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
    from './../../Core/Validation/ValidationDecorators';
import {SalonSchedule} from './SalonSchedule'
var ErrorMessage = require  ('./../../Core/ErrorMessage');
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
        
        //Step 1: get salon's [DailyDayData] for same date;
        let salonSchedule = new SalonSchedule(this.salonId);
        let promiseSalonDailyScheduleData = await salonSchedule.getDailySchedule(dailySchedule.date);
        let salonDailyScheduleData = promiseSalonDailyScheduleData.data;

        if (salonDailyScheduleData) {
            //Step 2: logically choose the best schedule for that day;
            var employeeDailyDayData = dailySchedule;
            employeeDailyDayData = this.updateDailyDayDataAccordingToSalon(employeeDailyDayData, salonDailyScheduleData.day);
            
            //Step 3: case 1: return updated DailyDayData;
            return employeeDailyDayData;
        } else {
            //Step 3: case 2: return null if salon has no schedule on that date
            return null;
        }

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

        //Step 1: get salon's [WeeklyDayData];
        let salonSchedule = new SalonSchedule(this.salonId);
        let promiseSalonWeeklyScheduleData = await salonSchedule.getWeeklySchedule();
        let salonWeeklyScheduleData = promiseSalonWeeklyScheduleData.data;

        if (salonWeeklyScheduleData) {
            // Sort [WeekyDayData] of employee & salon in the same order prior to compare each WeekyDayData item
            let asc = true;
            var employeeWeeklyDayDataArray = this.sortWeeklyDayDataArray(WeeklySchedule, asc);
            let salonWeeklyDayDataArray = this.sortWeeklyDayDataArray(salonWeeklyScheduleData.week, asc);

            //Step 2: loop through each day in array, logically choose the best schedule for that day;
            for (var i = 0; i < employeeWeeklyDayDataArray.length; i++) {
                var employeeWeeklyDayData = employeeWeeklyDayDataArray[i];
                var salonWeeklyDayData = salonWeeklyDayDataArray[i];

                employeeWeeklyDayData = this.updateDailyDayDataAccordingToSalon(employeeWeeklyDayData, salonWeeklyDayData);
            }

            //Step 3: case 1: return updated [WeeklyDayData]
            return employeeWeeklyDayDataArray;
        } else {
            //Step 3: case 2: return null if salon has no weeklySchedule
            return null;
        }

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
        // Employee's end time is later than salon's openning time ==> employee OFF
        // Return immediately
        if (employeeDayData.close < salonDayData.open) {
            employeeDayData.status = false;
            return employeeDayData;
        }

        // Employee's start time is earlier than salon's closing time ==> employee OFF
        // Return immediately
        if (employeeDayData.open > salonDayData.close) {
            employeeDayData.status = false;
            return employeeDayData;
        }

        // If Salon OFF --> Employee OFF
        if (salonDayData.status == false) {
            employeeDayData.status = false;
        }
        
        // Employee's start time is earlier than salon's openning time ==> re-assign salon's openning time to employee's
        if (employeeDayData.open < salonDayData.open) {
            employeeDayData.open = salonDayData.open;
        }

        // Employee's end time is later than salon's close time ==> re-assign salon's close time to employee's
        if (employeeDayData.close > salonDayData.close) {
            employeeDayData.close = salonDayData.close;
        }

        return employeeDayData;
    }
}