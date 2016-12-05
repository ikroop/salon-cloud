/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { DailyScheduleArrayData, IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData, DailyScheduleData } from './ScheduleData';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { ScheduleBehavior } from './ScheduleBehavior';
import WeeklyScheduleModel = require('./WeeklyScheduleModel');
import DailyScheduleModel = require('./DailyScheduleModel');
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { SalonTime } from './../../Core/SalonTime/SalonTime'

import { ErrorMessage } from './../../Core/ErrorMessage';
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsInRangeExclusively, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidSalonTimeData }
    from './../../Core/Validation/ValidationDecorators';

export abstract class Schedule implements ScheduleBehavior {
	/**
     * getDailySchedule
	 *
     */
    protected salonId: string;
    protected employeeId: string;


    //this constructor will only be called in subclass contructors;
    //we defer the identification of salonId and employeeId to subclass.
    constructor(salonId: string, employeeId: string) {
        this.salonId = salonId;
        this.employeeId = employeeId;
    };

    public static addDefaultSchedule(salonId: string) {

    }

    /**
	*@name: getDailySchedule(date: Date)
    *@parameter: {date: Date}
    *@return: a promise resolved to SalonCloudResponse<DailyScheduleData>
    *Step 1: validation;
    *Step 2: call this.getDailyScheduleProcess(date) to get DailyDayData
    *Step 3: check the returned value in step 2 and return the proper reponse.
	*/
    public async getDailySchedule(start: SalonTimeData, end: SalonTimeData): Promise<SalonCloudResponse<DailyScheduleArrayData>> {
        var resultReturn: DailyScheduleArrayData = {
            days: undefined,
            salon_id: undefined,
            employee_id: undefined
        };

        var response: SalonCloudResponse<DailyScheduleArrayData> = {
            code: undefined,
            data: resultReturn,
            err: undefined
        };

        //TODO: Step 1: implement validation

        //Step 2: call this.getDailyScheduleProcess(date) to get DailyDayData
        var scheduleSearch = await this.getDailyScheduleProcess(start, end);

        //parse data into resultReturn : dailyScheduleData 
        resultReturn.days = scheduleSearch;
        resultReturn.salon_id = this.salonId;
        resultReturn.employee_id = this.employeeId;
        response.code = 200;
        return response;
    }

    /**
	*@name: getWeeklySchedule()
    *@parameter: { }
    *@return: a promise resolved to SalonCloudResponse<WeeklyScheduleData>
    *Step 1: call this.getWeeklyScheduleRecord(date) to get WeeklyDayData[]
    *Step 2: check the returned value in step 1 and return the proper reponse.
	*/
    public async getWeeklySchedule() {
        var response: SalonCloudResponse<WeeklyScheduleData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var resultReturn: WeeklyScheduleData = {
            salon_id: undefined,
            employee_id: undefined,
            week: undefined
        };

        //Step 1: call this.getWeeklyScheduleRecord(date) to get WeeklyDayData[]

        var weeklyScheduleArray: WeeklyDayData[] = await this.getWeeklyScheduleRecord();

        //Step 2: check the returned value in step 1 and return the proper reponse.

        if (weeklyScheduleArray) {
            //normalize to get the best schedule
            weeklyScheduleArray = await this.normalizeWeeklySchedule(weeklyScheduleArray);

            //parse data into resultReturn : weeklyScheduleData 
            resultReturn.week = weeklyScheduleArray;
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
	*@name: saveDailySchedule(dailySchedule: DailyDayData)
    *@parameter: {dailySchedule: DailyDayData}
    *@return: a promise resolved to SalonCloudResponse<boolean>
    *Step 1: validation;
    *Step 2: check docs existence by calling this.checkDailySchedule(dailySchedule)
    *Step 3: if docs exists: call this.updateDailySchedule(dailySchedule);
             if docs does not exist: call this.addDailySchedule(dailySchedule);
    *Step 4: check result form step 3 and return proper response;
	*/
    public async saveDailySchedule(dailySchedule: DailyDayData) {

        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;
        //Step 1: validation;
        var errorReturn = await this.dailyScheduleValidation(dailySchedule);
        if (errorReturn) {
            response.code = 400;
            response.err = errorReturn;
            return response;
        }

        //Step 2: check docs existence by calling this.checkDailySchedule(dailySchedule)
        var existence = await this.checkDailySchedule(dailySchedule);
        //Step 3: if docs exists: call this.updateDailySchedule(dailySchedule);
        //        if docs does not exist: call this.addDailySchedule(dailySchedule);
        if (existence.err) {
            saveStatus = undefined;
        } else {
            if (existence.data) {
                saveStatus = await this.updateDailySchedule(dailySchedule);
            } else {
                saveStatus = await this.addDailySchedule(dailySchedule);
            }
        }

        //Step 4: check result form step 3 and return proper response;
        response.data = saveStatus.data;
        if (!saveStatus.err) {
            response.code = 200;
            response.err = undefined;
        } else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }

        return response;
    }

    /**
	*@name: saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[])
    *@parameter: {weeklyScheduleList: WeeklyDayData[]}
    *@return: a promise resolved to SalonCloudResponse<boolean>
    *Step 1: validation;
    *Step 2: check docs existence by calling this.checkWeeklySchedule(weeklyScheduleList)
    *Step 3: if docs exists: call this.updateDailySchedule(weeklyScheduleList);
             if docs does not exist: call this.addDailySchedule(weeklyScheduleList);
    *Step 4: check result form step 3 and return proper response;
	*/
    public async saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[]) {
        var response: SalonCloudResponse<IWeeklyScheduleData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        var saveStatus;

        //Step 1: validation
        var errorReturn = await this.weeklyScheduleValidation(weeklyScheduleList);
        if (errorReturn) {
            response.code = 400;
            response.err = errorReturn;
            return response;
        }
        //check docs existence: yes>>>process update, no>>>> procee add
        var k = await this.checkWeeklySchedule();
        if (k.err) {
            saveStatus = undefined;
        } else {
            if (k.data) {
                saveStatus = await this.updateWeeklySchedule(weeklyScheduleList);
            } else {
                saveStatus = await this.addWeeklySchedule(weeklyScheduleList);
            }
        }

        response.data = saveStatus.data;
        if (!saveStatus.err) {
            response.code = 200;
            response.err = undefined;
        } else {
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
    private async checkWeeklySchedule() {
        var returnResult: SalonCloudResponse<boolean> = {
            err: undefined,
            code: undefined,
            data: undefined
        };
        var result = await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec(function (err, docs) {
            if (err) {
                return returnResult.err = err;
            } else if (docs) {
                return returnResult.data = true;
            } else {
                return returnResult.data = false;
            }
        });
        return returnResult;
    };

    /**
     * @name: addWeeklySchedule(weeklyScheduleList: WeeklyDayData[])
     * @parameter: {weeklyScheduleList: WeeklyDayData[]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: create new docs of WeeklyScheduleModel with salonId, employeeId, and weeklyScheduleList
     * Step 2: return true if success
     *         return error if fail
     */
    private async addWeeklySchedule(weeklyScheduleList: WeeklyDayData[]) {
        var returnResult: SalonCloudResponse<IWeeklyScheduleData> = {
            code: undefined,
            err: undefined,
            data: undefined,
        };
        var weeklySchedule = new WeeklyScheduleModel({
            salon_id: this.salonId,
            employee_id: this.employeeId,
            week: weeklyScheduleList,
        });
        var dataCreation = weeklySchedule.save();
        await dataCreation.then(function (docs) {
            returnResult.data = docs;
            return;
        }, function (error) {
            returnResult.err = error
            return;
        })

        return returnResult;
    };

    /**
     * @name: updateWeeklySchedule(weeklyScheduleList: WeeklyDayData[])
     * @parameter: {weeklyScheduleList: WeeklyDayData[]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: find docs WeeklyScheduleModel with salonId, employeeId
     * Step 2: update 'week' in docs with weeklyScheduleList
     * Step 3: save the edited docs
     * Step 4: return true if save success  
     *         return error if fail
     */
    private async updateWeeklySchedule(weeklyScheduleList: WeeklyDayData[]) {
        var returnResult: SalonCloudResponse<IWeeklyScheduleData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec();

        docsFound.week = weeklyScheduleList;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs) {

            returnResult.data = docs;

        }, function (err) {

            returnResult.err = err;

        })
        return returnResult;
    };

    /**
     * @name: weeklyScheduleValidation(weeklyScheduleList: WeeklyDayData[])
     * @parameter: {weeklyScheduleList: WeeklyDayData[]}
     * @return: error if any
     * Use Validator in core
     */
    private async weeklyScheduleValidation(weeklyScheduleList: WeeklyDayData[]) {
        var errorReturn: any = undefined;

        var tempArray: [any] = <any>[];
        for (let i = 0; i <= 6; i++) {
            var openTimeValidator = new BaseValidator(weeklyScheduleList[i].open);
            openTimeValidator = new MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
            openTimeValidator = new IsNumber(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime);
            openTimeValidator = new IsInRangeExclusively(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
            openTimeValidator = new IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, weeklyScheduleList[i].close);
            var openTimeResult = await openTimeValidator.validate();
            if (openTimeResult) {
                return errorReturn = openTimeResult;
            }

            var closeTimeValidator = new BaseValidator(weeklyScheduleList[i].close);
            closeTimeValidator = new MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
            closeTimeValidator = new IsNumber(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime);
            closeTimeValidator = new IsInRangeExclusively(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
            var closeTimeResult = await closeTimeValidator.validate();
            if (closeTimeResult) {
                return errorReturn = closeTimeResult;
            }

            var dayOfWeekValidator = new BaseValidator(weeklyScheduleList[i].day_of_week);
            dayOfWeekValidator = new MissingCheck(dayOfWeekValidator, ErrorMessage.MissingDayOfWeek);
            dayOfWeekValidator = new IsNumber(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek);
            dayOfWeekValidator = new IsInRange(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek, 0, 6);
            dayOfWeekValidator = new IsNotInArray(dayOfWeekValidator, ErrorMessage.DuplicateDaysOfWeek, tempArray);
            var dayOfWeekResult = await dayOfWeekValidator.validate();
            if (dayOfWeekResult) {
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
    private async checkDailySchedule(dailySchedule: DailyDayData) {
        var returnResult: SalonCloudResponse<boolean> = {
            err: undefined,
            code: undefined,
            data: undefined
        }

        var result = await DailyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId, 'day.date.year': dailySchedule.date.year, 'day.date.month': dailySchedule.date.month, 'day.date.day': dailySchedule.date.day }).exec(function (err, docs) {
            if (err) {
                return returnResult.err = err;
            } else if (docs) {
                return returnResult.data = true;
            } else {
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
    private async addDailySchedule(dailySchedule: DailyDayData): Promise<SalonCloudResponse<IDailyScheduleData>> {
        var returnResult: SalonCloudResponse<IDailyScheduleData> = {
            code: undefined,
            err: undefined,
            data: undefined,
        };

        var dataCreation = DailyScheduleModel.create({
            salon_id: this.salonId,
            employee_id: this.employeeId,
            day: dailySchedule,
        })
        await dataCreation.then(function (docs: IDailyScheduleData) {
            returnResult.data = docs;
            return;
        }, function (error) {
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
    private async updateDailySchedule(dailySchedule: DailyDayData) : Promise<SalonCloudResponse<IDailyScheduleData>>{
        var returnResult: SalonCloudResponse<IDailyScheduleData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await DailyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec();

        docsFound.day = dailySchedule;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs: IDailyScheduleData) {
            returnResult.data = docs;
            return;
        }, function (err) {
            returnResult.err = err;
            return;
        })
        return returnResult;
    };

    /**
     * @name: dailyScheduleValidation(dailySchedule: DailyDayData))
     * @parameter: {dailySchedule: DailyDayData}
     * @return: error if any
     * Use Validator in core
     */
    private async dailyScheduleValidation(dailySchedule: DailyDayData) {
        var errorReturn: any = undefined;

        var closeTimeValidator = new BaseValidator(dailySchedule.close);
        closeTimeValidator = new MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
        closeTimeValidator = new IsNumber(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime);
        closeTimeValidator = new IsInRangeExclusively(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 86400);

        var closeTimeResult = await closeTimeValidator.validate();
        if (closeTimeResult) {
            return errorReturn = closeTimeResult;
        }

        var openTimeValidator = new BaseValidator(dailySchedule.open);
        openTimeValidator = new MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
        openTimeValidator = new IsNumber(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime);
        openTimeValidator = new IsInRangeExclusively(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
        openTimeValidator = new IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, dailySchedule.close);
        var openTimeResult = await openTimeValidator.validate();
        if (openTimeResult) {
            return errorReturn = openTimeResult;
        }
        //Todo: validate date;
        var dateValidator = new BaseValidator(dailySchedule.date);
        dateValidator = new MissingCheck(dateValidator, ErrorMessage.MissingDate);
        dateValidator = new IsValidSalonTimeData(dateValidator, ErrorMessage.InvalidSalonTimeData);
        var dateError = await dateValidator.validate();
        if (dateError) {
            return errorReturn = dateError;
        }


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
    protected async getDailyScheduleRecord(startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var returnResult: IDailyScheduleData[] = undefined;

        var dailyDocsReturn = await DailyScheduleModel.find({
            salon_id: this.salonId, employee_id: this.employeeId, 'day.date.date': {
                $gte: startDate.date, $lte: endDate.date
            }
        }).exec(function (err, docs: IDailyScheduleData[]) {
            if (err) {
                console.log('err: ', err);
            } else {
                if (!docs) {
                    returnResult = undefined;
                } else {
                    returnResult = docs;
                }
            }
        });
        return returnResult;
    }

    /**
     * @name: getWeeklyScheduleRecord()
     * @parameter: {}
     * @return: a promise resolved to SalonCloudResponse<WeeklyDayData[]>
     * Step 1: find docs of WeeklyScheduleModel with salonId, employeeId
     * Step 2: return err if fail
     *         return undefined if docs not found
     *         return docs.day date if found
     */
    protected async getWeeklyScheduleRecord(): Promise<WeeklyDayData[]> {
        var returnResult: WeeklyDayData[] = undefined;
        var weeklyDocsReturn = await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec(function (err, docs: IWeeklyScheduleData) {
            if (err) {
                returnResult = undefined;
                console.log(err)
            } else {
                if (!docs) {
                    returnResult = undefined;
                } else {
                    returnResult = docs.week;
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
    private async getDailyScheduleProcess(startDate: SalonTimeData, endDate: SalonTimeData): Promise<DailyDayData[]> {

        var targetSchedule: DailyDayData[] = [];
        var weeklyScheduleArray: WeeklyDayData[] = await this.getWeeklyScheduleRecord();
        var dailyScheduleArray: IDailyScheduleData[] = await this.getDailyScheduleRecord(startDate, endDate);

        var dailyScheduleArrayCount: number = 0;
        for (var date = startDate.date, count = 0; date <= endDate.date; date.setUTCDate(date.getUTCDate() + 1), count++) {
            var dailySchedule = undefined;
            if (dailyScheduleArrayCount < dailyScheduleArray.length) {
                dailySchedule = dailyScheduleArray[dailyScheduleArrayCount];
                dailySchedule.day.date.date.setUTCHours(0, 0, 0, 0);

            }

            date.setUTCHours(0, 0, 0, 0);
            targetSchedule[count] = {
                open: undefined,
                close: undefined,
                status: undefined,
                date: undefined
            };
            if (!dailySchedule || date.getTime() != dailySchedule.day.date.date.getTime()) {

                //get dailySchedule from weeklySchedule
                if (weeklyScheduleArray) {
                    var indexDay = date.getUTCDay();
                    for (var i = 0; i <= 6; i++) {
                        if (weeklyScheduleArray[i].day_of_week == indexDay) {
                            targetSchedule[count].open = weeklyScheduleArray[i].open;
                            targetSchedule[count].close = weeklyScheduleArray[i].close;
                            targetSchedule[count].status = weeklyScheduleArray[i].status;
                            targetSchedule[count].date = (new SalonTime()).setDate(date);
                        }
                    }
                }
            } else {

                targetSchedule[count].open = dailySchedule.day.open;
                targetSchedule[count].close = dailySchedule.day.close;
                targetSchedule[count].status = dailySchedule.day.status;
                targetSchedule[count].date = (new SalonTime()).setDate(date);
                dailyScheduleArrayCount = dailyScheduleArrayCount + 1;
            }
        }
        var normalization = await this.normalizeDailySchedule(targetSchedule);
        return normalization;
    }

    /**
     * sortWeeklyDayData
     * Sort a given array of WeeklyDayDatas in order ASC or DESC
     * @param {WeeklyDayData[]} weeklyDayDataArray
     * @param {boolean} ascending: true -> sort in ASC order, false -> sort in DESC order
     * @returns {WeeklyDayData[]} sorted array of WeeklyDayDatas
     */
    protected sortWeeklyDayDataArray(weeklyDayDataArray: WeeklyDayData[], ascending: boolean) {
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
    protected abstract normalizeDailySchedule(dailySchedule: DailyDayData[]);
    protected abstract normalizeWeeklySchedule(weeklySchedule: WeeklyDayData[]);

}