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

    protected salonId: string;
    protected employeeId: string;
    constructor (salonId: string, employeeId: string){
        super();
        this.salonId = salonId;
        this.employeeId = employeeId;
        
    }

    protected async addDailySchedule(dailySchedule: DailyDayData) {
        var returnResult: SalonCloudResponse<boolean>={
            code: undefined,
            err: undefined,
            data: undefined,
        };
        
        var dataCreation = DailyScheduleModel.create({
            salon_id: this.salonId,
            employee_id: this.employeeId,
            day: dailySchedule,
        })
        await dataCreation.then(function(docs){
            returnResult.data = true;
            return;
        },function(error){
            returnResult.err = error
            return;
        })

        

        return returnResult;
    }

    protected async addWeeklySchedule(weeklyScheduleList: [WeeklyDayData]) {
         var returnResult: SalonCloudResponse<boolean>={
            code: undefined,
            err: undefined,
            data: undefined,
        };
        
        var dataCreation = WeeklyScheduleModel.create({
            salon_id: this.salonId,
            employee_id: this.employeeId,
            week: weeklyScheduleList,
        })
        await dataCreation.then(function(docs){
            returnResult.data = true;
            return;
        },function(error){
            returnResult.err = error
            return;
        })

        

        return returnResult;    }

    protected async checkDailySchedule(dailySchedule: DailyDayData) {
        var returnResult: SalonCloudResponse<boolean> = {
            err: undefined,
            code: undefined,
            data:undefined
        }

        var result = await DailyScheduleModel.findOne({salon_id: this.salonId, employee_id: this.employeeId, "day.date": dailySchedule._id}).exec( function(err, docs){
            if(err){
                return returnResult.err = err;
            }else if(docs){
                return returnResult.data = true;
            }else{
                return returnResult.data = false;
            }
            })
        return returnResult;    }

    protected async checkWeeklySchedule(){
        var returnResult : SalonCloudResponse<boolean> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var result = await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId}).exec( function(err, docs){
            if(err){
                return returnResult.err = err;
            }else if(docs){
                return returnResult.data = true;
            }else{
                return returnResult.data = false;
            }
        });
        return returnResult;    }

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

    protected async updateDailySchedule(dailySchedule: DailyDayData){
         var returnResult: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await DailyScheduleModel.findOne({salon_id:this.salonId, employee_id: this.employeeId}).exec();
        
        docsFound.day = dailySchedule;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function(docs){

            returnResult.data = true;

        }, function(err){

            returnResult.err = err;

        })
        return returnResult;
    }
    
    protected async updateWeeklySchedule(weeklyScheduleList: [WeeklyDayData]) {
        var returnResult: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await WeeklyScheduleModel.findOne({salon_id:this.salonId, employee_id: this.employeeId}).exec();
        
        docsFound.week = weeklyScheduleList;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function(docs){

            returnResult.data = true;

        }, function(err){

            returnResult.err = err;

        })
        return returnResult;
           }

       protected async weeklyScheduleValidation(weeklyScheduleList: [WeeklyDayData]){

        var errorReturn: any = undefined;
        /*var salonIdValidator = new BaseValidator(this.salonId);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
        //TODO: validate salon Id;
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
        var salonIdResult = await salonIdValidator.validate();
        if(salonIdResult){
            return errorReturn = salonIdResult;
        }*/

        var tempArray:[any] = <any>[];
        for(let i = 0; i<=6; i++){
            var openTimeValidator = new BaseValidator(weeklyScheduleList[i].open);
            openTimeValidator = new MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
            openTimeValidator = new IsNumber(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime);
            openTimeValidator = new IsInRange(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
            openTimeValidator = new IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, weeklyScheduleList[i].close);
            var openTimeResult = await openTimeValidator.validate();
            if(openTimeResult){
                return errorReturn = openTimeResult;
            }

            var closeTimeValidator = new BaseValidator(weeklyScheduleList[i].close);
            closeTimeValidator = new MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
            closeTimeValidator = new IsNumber(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime);
            closeTimeValidator = new IsInRange(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
            var closeTimeResult = await closeTimeValidator.validate();
            if(closeTimeResult){
                return errorReturn = openTimeResult;
            }

            var dayOfWeekValidator = new BaseValidator(weeklyScheduleList[i].day_of_week);
            dayOfWeekValidator = new MissingCheck(dayOfWeekValidator, ErrorMessage.MissingDayOfWeek);
            dayOfWeekValidator = new IsNumber(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek);
            dayOfWeekValidator = new IsInRange(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek, 0, 6);
            dayOfWeekValidator = new IsNotInArray(dayOfWeekValidator, ErrorMessage.DuplicateDayOfWeek, tempArray);
            var dayOfWeekResult = await dayOfWeekValidator.validate();
            if(dayOfWeekResult){
                return errorReturn = dayOfWeekResult;
            }

            tempArray.push(weeklyScheduleList[i].day_of_week);
        }
        return errorReturn;
    }

    protected async dailyScheduleValidation(dailySchedule: DailyDayData){
        var errorReturn: any = undefined;

        /*var salonIdValidator = new BaseValidator(this.salonId);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
        var salonIdResult = await salonIdValidator.validate();
        if(salonIdResult){
            return errorReturn = salonIdResult;
        }*/

        var openTimeValidator = new BaseValidator(dailySchedule.open);
            openTimeValidator = new MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
            openTimeValidator = new IsNumber(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime);
            openTimeValidator = new IsInRange(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
            openTimeValidator = new IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, dailySchedule.close);
            var openTimeResult = await openTimeValidator.validate();
            if(openTimeResult){
                return errorReturn = openTimeResult;
            }
        
        var closeTimeValidator = new BaseValidator(dailySchedule.close);
            closeTimeValidator = new MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
            closeTimeValidator = new IsNumber(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime);
            closeTimeValidator = new IsInRange(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
            var closeTimeResult = await closeTimeValidator.validate();
            if(closeTimeResult){
                return errorReturn = openTimeResult;
            }
        //Todo: validate date;

        return errorReturn;
    }
}