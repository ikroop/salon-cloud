/*
 *
 *
 */
import { MonthlyScheduleData, DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
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

    /**
	*@name: getDailySchedule(date: Date)
    *@parameter: {date: Date}
    *@return: a promise resolved to SalonCloudResponse<DailyScheduleData>
    *Step 1: validation;
    *Step 2: call this.getDailyScheduleProcess(date) to get DailyDayData
    *Step 3: check the returned value in step 2 and return the proper reponse.
	*/
    public async getDailySchedule(date: Date) {
        var response: SalonCloudResponse<DailyScheduleData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //TODO: Step 1: implement validation
        var resultReturn: DailyScheduleData;
        var targetSchedule:DailyDayData; 

        //Step 2: call this.getDailyScheduleProcess(date) to get DailyDayData
        targetSchedule = await this.getDailyScheduleProcess(date);

        //Step 3: check the returned value in step 1 and return the proper reponse.
        if (targetSchedule) {
            //parse data into resultReturn : dailyScheduleData 
            resultReturn.day = targetSchedule;
            resultReturn.salon_id = this.salonId;
            resultReturn.employee_id = this.employeeId;
            
            response.err = undefined;
            response.data = resultReturn;
            response.code = 200;
        } else {
            response.err = ErrorMessage.ServerError;
            response.data = undefined;
            response.code = 500;
        }

        return response;
    }

    /**
	*@name: getWeeklySchedule()
    *@parameter: { }
    *@return: a promise resolved to SalonCloudResponse<WeeklyScheduleData>
    *Step 1: call this.getWeeklyScheduleRecord(date) to get [WeeklyDayData]
    *Step 2: check the returned value in step 1 and return the proper reponse.
	*/    
    public async getWeeklySchedule(){
        var response: SalonCloudResponse<WeeklyScheduleData>={
            code: undefined,
            data: undefined,
            err: undefined
        };
        var resultReturn: WeeklyScheduleData;

        //Step 1: call this.getWeeklyScheduleRecord(date) to get [WeeklyDayData]

        var weeklySchedule = await this.getWeeklyScheduleRecord();

        //Step 2: check the returned value in step 1 and return the proper reponse.

        if (weeklySchedule.data) {
            //normalize to get the best schedule
            weeklySchedule.data = await this.normalizeWeeklySchedule(weeklySchedule.data);

            //parse data into resultReturn : weeklyScheduleData 
            resultReturn.week = weeklySchedule.data;
            resultReturn.salon_id = this.salonId;
            resultReturn.employee_id = this.employeeId;
            
            response.err = undefined;
            response.code = 200;
            response.data = resultReturn;
        } else {
            response.err = ErrorMessage.ServerError;
            response.code = 500;
            response.data = undefined;
        }
        return response;
    }

    /**
	*@name: getMonthlySchedule(month: number; year: number)
    *@parameter: {month: number, year: number}
    *@return: a promise resolved to SalonCloudResponse<MonthlyScheduleData>
    *Step 1: validation;
    *Step 2: loop and call this.getDailyScheduleProcess(date) for each day in month to get [DailyDayData]
    *Step 3: parse data to response to return;
	*/
    public async getMonthlySchedule(month: number, year: number){
        var response: SalonCloudResponse<MonthlyScheduleData>= {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //Todo: Step 1: validation;

        //prepare for the loop
        var returnValue : MonthlyScheduleData;
        var dataReturn : [DailyDayData];
        var firstDayOfMonth =  new Date(year, month, 1, 0, 0, 0, 0);
        var lastDayOfMonth = new Date(year, month+1, 0, 0, 0, 0, 0);
        var currentDate = firstDayOfMonth;

        //Step 2: loop and call this.getDailyScheduleProcess(date) for each day in month to get [DailyDayData]
        for(var i = 1;currentDate > lastDayOfMonth; currentDate.setDate(i)){
            console.log(i);
            var targetSchedule = await this.getDailyScheduleProcess(currentDate);
            i++;
            dataReturn.push(targetSchedule);
        }

        //Step 3: parse data to response to return;

        returnValue.salon_id = this.salonId;
        returnValue.employee_id = this.employeeId;
        returnValue.month = dataReturn;

        response.data = returnValue;
        
        return response;
    }

    /**
	*@name: saveDailySchedule(dailySchedule: DailyDayData)
    *@parameter: {dailySchedule: DailyDayData}
    *@return: a promise resolved to SalonCloudResponse<boolean>
    *Step 1: validation;
    *Step 2: check docs existence by calling this.checkDailySchedule(dailySchedule)
    *Step 3: if docs exists: call this.updateDailySchedule(dailySchedule);
             if docs does not exist: call this.addDailySchedule(dailySchedule);
    *Step 4: check result form step 3 and return proper response;
	*/
    public async saveDailySchedule(dailySchedule: DailyDayData){

        var response: SalonCloudResponse<boolean>={
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;

        //Step 1: validation;
        var errorReturn = await this.dailyScheduleValidation(dailySchedule);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }

        //Step 2: check docs existence by calling this.checkDailySchedule(dailySchedule)
        var existence = await this.checkDailySchedule(dailySchedule);

        //Step 3: if docs exists: call this.updateDailySchedule(dailySchedule);
        //        if docs does not exist: call this.addDailySchedule(dailySchedule);
        if(existence.err){
            saveStatus = undefined;
        }else{
            if (existence.data) {
                saveStatus = await this.updateDailySchedule(dailySchedule);
          } else {
                saveStatus = await this.addDailySchedule(dailySchedule);
            }
        }

        //Step 4: check result form step 3 and return proper response;
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
	*@name: saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData])
    *@parameter: {weeklyScheduleList: [WeeklyDayData]}
    *@return: a promise resolved to SalonCloudResponse<boolean>
    *Step 1: validation;
    *Step 2: check docs existence by calling this.checkWeeklySchedule(weeklyScheduleList)
    *Step 3: if docs exists: call this.updateDailySchedule(weeklyScheduleList);
             if docs does not exist: call this.addDailySchedule(weeklyScheduleList);
    *Step 4: check result form step 3 and return proper response;
	*/
    public async saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData]){

        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        var saveStatus;

        //Step 1: validation
        var errorReturn = await this.weeklyScheduleValidation(weeklyScheduleList);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }
        //check docs existence: yes>>>process update, no>>>> procee add
        var k = await this.checkWeeklySchedule();
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
            saveStatus = await this.updateWeeklySchedule(weeklyScheduleList);
        } else {
            saveStatus = await this.addWeeklySchedule(weeklyScheduleList);
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
     * @name checkWeeklySchedule()
     * @parameter: { }
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: find WeeklyScheduleModel docs with salonId and employeeId
     * Step 2: if docs exist, return data as true
     *         if docs does not exist, return data as false
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
     * @name: addWeeklySchedule(weeklyScheduleList: [WeeklyDayData])
     * @parameter: {weeklyScheduleList: [WeeklyDayData]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: create new docs of WeeklyScheduleModel with salonId, employeeId, and weeklyScheduleList
     * Step 2: return true if success
     *         return error if fail
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
     * @name: updateWeeklySchedule(weeklyScheduleList: [WeeklyDayData])
     * @parameter: {weeklyScheduleList: [WeeklyDayData]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: find docs WeeklyScheduleModel with salonId, employeeId
     * Step 2: update 'week' in docs with weeklyScheduleList
     * Step 3: save the edited docs
     * Step 4: return true if save success  
     *         return error if fail
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
     * @name: weeklyScheduleValidation(weeklyScheduleList: [WeeklyDayData])
     * @parameter: {weeklyScheduleList: [WeeklyDayData]}
     * @return: error if any
     * Use Validator in core
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
                return errorReturn = closeTimeResult;
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
     * @name checkDailySchedule(dailySchedule: DailyDayData)
     * @parameter: {dailySchedule: DailyDayData}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: find DailyScheduleModel docs with salonId, employeeId and date
     * Step 2: if docs exist, return data as true
     *         if docs does not exist, return data as false
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
     * @name: addDailySchedule(dailySchedule: DailyDayData)
     * @parameter: {dailySchedule: DailyDayData]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: create new docs of DailyScheduleModel with salonId, employeeId, and dailySchedule
     * Step 2: return true if success
     *         return error if fail
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
     * @name: updateDailySchedule(dailySchedule: DailyDayData)
     * @parameter: {dailySchedule: DailyDayData}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: find docs dailyScheduleModel with salonId, employeeId, and date
     * Step 2: update 'day' in docs with weeklyScheduleList
     * Step 3: save the edited docs
     * Step 4: return true if save success  
     *         return error if fail
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
     * @name: dailyScheduleValidation(dailySchedule: DailyDayData))
     * @parameter: {dailySchedule: DailyDayData}
     * @return: error if any
     * Use Validator in core
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
     * @name: getDailyScheduleRecord(date: Date)
     * @parameter: {date: Date}
     * @return: a promise resolved to SalonCloudResponse<DailyDayData>
     * Step 1: find docs of DailyScheduleModel with salonId, employeeId, and date
     * Step 2: return err if fail
     *         return undefined if docs not found
     *         return docs.day date if found
     */
    protected async getDailyScheduleRecord(date: Date){
        var returnResult : SalonCloudResponse<DailyDayData> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var dailyDocsReturn = await DailyScheduleModel.findOne({salonId: this.salonId, employeeId: this.employeeId, 'day.date': date}).exec(function(err, docs){
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
     * @name: getWeeklyScheduleRecord()
     * @parameter: {}
     * @return: a promise resolved to SalonCloudResponse<[WeeklyDayData]>
     * Step 1: find docs of WeeklyScheduleModel with salonId, employeeId
     * Step 2: return err if fail
     *         return undefined if docs not found
     *         return docs.day date if found
     */
    protected async getWeeklyScheduleRecord(){
        var returnResult : SalonCloudResponse<[WeeklyDayData]> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var weeklyDocsReturn = await WeeklyScheduleModel.findOne({salonId: this.salonId, employeeId: this.employeeId}).exec(function(err, docs){
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
    /**
     * @name: getDailyScheduleRecord(date: Date)
     * @parameter: {date: Date}
     * @return: a promise that resolve to DailyDayData
     * Step 1: call getDailyScheduleRecord
     * Step 2: if dailySchedule data not found, getWeeklyScheduleRecord. get dailySchedule from weeklySchedule
     * Step 3: normalizeDailySchedule the dailySchedule found in step 1 or step 2.
     * Step 4: return undefinded if no dailySchedule found 
     */
    private async getDailyScheduleProcess(date: Date) {
        var targetSchedule:DailyDayData;
        var dailySchedule = await this.getDailyScheduleRecord(date);
        if (!dailySchedule.data) {
            var weeklySchedule = await this.getWeeklyScheduleRecord();
            
            //get dailySchedule from weeklySchedule
            if(weeklySchedule){
               var indexDay = date.getDay();
               for(var i=0; i<=6; i++){
                  if(weeklySchedule.data[i].day_of_week == indexDay){
                          targetSchedule.open = weeklySchedule.data[i].open;
                          targetSchedule.close = weeklySchedule.data[i].close;
                          targetSchedule.status = weeklySchedule.data[i].status;
                          targetSchedule.date = date;
                    }
                }
            }

        }else{
            targetSchedule = dailySchedule.data;
        }
        if(targetSchedule){
            targetSchedule = await this.normalizeDailySchedule(targetSchedule);
            return targetSchedule;

        }else{
            return undefined;
        }
    }
    /**
     * sortWeeklyDayData
     * Sort a given array of WeeklyDayDatas in order ASC or DESC
     * @param {[WeeklyDayData]} weeklyDayDataArray
     * @param {boolean} ascending: true -> sort in ASC order, false -> sort in DESC order
     * @returns {[WeeklyDayData]} sorted array of WeeklyDayDatas
     */
    protected sortWeeklyDayDataArray(weeklyDayDataArray: [WeeklyDayData], ascending: boolean) {
        let asc = (ascending) ? 1 : -1;

        var sortedArray = weeklyDayDataArray.sort((n1, n2) => {
            if (n1.day_of_week > n2.day_of_week) {
                return 1 * asc;
            }

            if (n1.day_of_week < n2.day_of_week) {
                return -1 * asc;
            }

            return 0;
        });

        return sortedArray;
    }
    protected abstract normalizeDailySchedule(dailySchedule: DailyDayData);
    protected abstract normalizeWeeklySchedule(weeklySchedule: [WeeklyDayData]);

}