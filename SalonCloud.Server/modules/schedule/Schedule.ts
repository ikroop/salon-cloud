/*
 *
 *
 */
import { DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ScheduleBehavior} from "./ScheduleBehavior";
import {WeeklyScheduleModel, DailyScheduleModel} from "./ScheduleModel";
var ErrorMessage = require('./../../core/ErrorMessage');
import {BaseValidator} from "./../../core/validation/BaseValidator";
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
 from "./../../core/validation/ValidationDecorators";

export abstract class Schedule implements ScheduleBehavior {
	/**
     * getDailySchedule
	 *
     */
    protected salonId: string;
    protected employeeId: string;
    
    //this constructor will only be called in subclass contructors;
    //we defer the identification of salonId and employeeId to subclass.
    constructor (salonId: string, employeeId: string){
        this.salonId = salonId;
        this.employeeId = employeeId;
    };

    public async getDailySchedule(date: Date) {
        var response: SalonCloudResponse<DailyDayData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //TODO: implement validation

        var targetSchedule:DailyDayData;
        var dailySchedule = await this.getDailyScheduleRecord(date);
        if (!dailySchedule.data) {
            var weeklySchedule = await this.getWeeklyScheduleRecord();
            
            //start: get dailySchedule from weeklySchedule
            var indexDay = date.getDay();
            for(var i=0; i<=6; i++){
                if(weeklySchedule.data[i].day_of_week == indexDay){
                        targetSchedule.open = weeklySchedule.data[i].open;
                        targetSchedule.close = weeklySchedule.data[i].close;
                        targetSchedule.status = weeklySchedule.data[i].status;
                        targetSchedule.date = date;
                }
            }

            //end: get dailySchedule from weeklySchedule
        }else{
            targetSchedule = dailySchedule.data;
        }


        if (targetSchedule) {
            targetSchedule = await this.normalizeDailySchedule(targetSchedule);
            response.err = undefined;
            response.data = targetSchedule;
            response.code = 200;
        } else {
            response.err = ErrorMessage.ServerError;
            response.data = undefined;
            response.code = 500;
        }

        return response;
    }

    /**
      * name
      */
    public async getWeeklySchedule(){
        var response: SalonCloudResponse<[WeeklyDayData]>={
            code: undefined,
            data: undefined,
            err: undefined
        };
        //TODO: implement validation

        var weeklySchedule = await this.getWeeklyScheduleRecord();
        if (weeklySchedule.data) {
            weeklySchedule.data = await this.normalizeWeeklySchedule(weeklySchedule.data);
            response.err = undefined;
            response.code = 200;
            response.data = weeklySchedule.data;
        } else {
            response.err = ErrorMessage.ServerError;
            response.code = 500;
            response.data = undefined;
        }
        return response;
    }

	/**
	*
	*/
    public getMonthlySchedule(month: number, year: number): SalonCloudResponse<[DailyDayData]> {
        var response: SalonCloudResponse<[DailyDayData]>;
        //TODO: use getDailyScheduleRecord(date)

        return response;
    }

    public async saveDailySchedule(dailySchedule: DailyDayData){

        var response: SalonCloudResponse<boolean>={
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;

        //validation
        var errorReturn = await this.dailyScheduleValidation(dailySchedule);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }

        //check docs existence: yes>>>> process update, no>>>>> process add
        var k = await this.checkDailySchedule(dailySchedule);
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
                saveStatus = await this.updateDailySchedule(dailySchedule);
          } else {
                saveStatus = await this.addDailySchedule(dailySchedule);
            }
        }
        response.data = saveStatus.data;

        if (!saveStatus.err){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        

        return response;
    }
    /**
     * name
     */
    public async saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData]){

        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        var saveStatus;

        //validation
        var errorReturn = await this.weeklyScheduleValidation(weeklyScheduleList);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }
        console.log('3');
        //check docs existence: yes>>>process update, no>>>> procee add
        var k = await this.checkWeeklySchedule();
        console.log('4', k)
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
            saveStatus = await this.updateWeeklySchedule(weeklyScheduleList);
            console.log('5', saveStatus);
        } else {
            saveStatus = await this.addWeeklySchedule(weeklyScheduleList);
            console.log('6', saveStatus);
        }
        }
        
        response.data = saveStatus.data;
        if (!saveStatus.err){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        

        return response;
        

    }

    /**
     * name
     */
    private async checkWeeklySchedule(){
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
        return returnResult;    
    };

    /**
     * name
     */
    private async addWeeklySchedule(weeklyScheduleList: [WeeklyDayData]){
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

        

        return returnResult; 
    };

    /**
     * name
     */
    private async updateWeeklySchedule(weeklyScheduleList: [WeeklyDayData]){
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
    };

    /**
     * name
     */
    private async weeklyScheduleValidation(weeklyScheduleList: [WeeklyDayData]){
        var errorReturn: any = undefined;

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
    };

    /**
     * name
     */
    private async checkDailySchedule(dailySchedule: DailyDayData){
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
        return returnResult;  
    };

    /**
     * name
     */
    private async addDailySchedule(dailySchedule: DailyDayData){
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
    };

    /**
     * name
     */
    private async updateDailySchedule(dailySchedule: DailyDayData){
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
    };

    /**
     * name
     */
    private async dailyScheduleValidation(dailySchedule: DailyDayData){
        var errorReturn: any = undefined;

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
    };

    /**
     * name
     */
    protected async getDailyScheduleRecord(date: Date){
        var returnResult : SalonCloudResponse<DailyDayData> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var dailyDocsReturn = await DailyScheduleModel.findOne({salonId: this.salonId, employeeId: null, 'day.date': date}).exec(function(err, docs){
            if(err){
                returnResult.err = err;
            }else{
                if(!docs){
                    returnResult.data = undefined;
                }else{
                    returnResult.data = docs.day;
                }
            }
        });
        return returnResult;
    }

    /**
     * name
     */
    protected async getWeeklyScheduleRecord(){
        var returnResult : SalonCloudResponse<[WeeklyDayData]> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var weeklyDocsReturn = await WeeklyScheduleModel.findOne({salonId: this.salonId, employeeId: null}).exec(function(err, docs){
            if(err){
                returnResult.err = err;
            }else{
                if(!docs){
                    returnResult.data = undefined;
                }else{
                    returnResult.data = docs.week;
                }
            }
        });
        return returnResult;
    }
    protected abstract normalizeDailySchedule(dailySchedule: DailyDayData);
    protected abstract normalizeWeeklySchedule(weeklySchedule: [WeeklyDayData]);

}