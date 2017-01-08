/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { DailyScheduleArrayData, IDailyScheduleData, IWeeklyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData, DailyScheduleData } from './ScheduleData';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { ScheduleBehavior } from './ScheduleBehavior';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { SalonTime } from './../../Core/SalonTime/SalonTime'

import { ErrorMessage } from './../../Core/ErrorMessage';
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsInRangeExclusively, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidSalonTimeData, IsSalonTime, IsAfterSecondDate }
    from './../../Core/Validation/ValidationDecorators';
import { ScheduleManagementDatabaseInterface } from './../../Services/ScheduleDatabase/ScheduleManagementDatabaseInterface';
import { FirebaseScheduleManagement } from './../../Services/ScheduleDatabase/Firebase/FirebaseScheduleManagement';

export abstract class Schedule implements ScheduleBehavior {

    protected salonId: string;
    protected employeeId: string;
    protected scheduleDatabase: ScheduleManagementDatabaseInterface<IDailyScheduleData, IWeeklyScheduleData>;

    //this constructor will only be called in subclass contructors;
    //we defer the identification of salonId and employeeId to subclass.

    /**
     * Creates an instance of Schedule.
     * 
     * @param {string} salonId
     * @param {string} employeeId
     * 
     * @memberOf Schedule
     */
    constructor(salonId: string, employeeId: string) {
        this.salonId = salonId;
        this.employeeId = employeeId;
        this.scheduleDatabase = new FirebaseScheduleManagement(this.salonId);
    };

    public static addDefaultSchedule(salonId: string) {

    }

    /**
     * Step 1: validation;
     * Step 2: call this.getDailyScheduleProcess(date) to get DailyDayData
     * Step 3: check the returned value in step 2 and return the proper reponse. 
     * @param {SalonTimeData} start
     * @param {SalonTimeData} end
     * @returns {Promise<SalonCloudResponse<DailyScheduleArrayData>>}
     * 
     * @memberOf Schedule
     */
    public async getDailySchedule(start: SalonTimeData, end: SalonTimeData): Promise<SalonCloudResponse<DailyScheduleArrayData>> {
        var resultReturn: DailyScheduleArrayData = {
            days: null,
            salon_id: null,
            employee_id: null
        };
        var response: SalonCloudResponse<DailyScheduleArrayData> = {
            code: null,
            data: resultReturn,
            err: null
        };

        var commonValidation = await this.validateCommon();
        if (commonValidation) {
            return commonValidation;
        }

        // validation start date
        var startDateValidation = new BaseValidator(start);
        startDateValidation = new IsSalonTime(startDateValidation, ErrorMessage.InvalidStartDate);
        var startDateError = await startDateValidation.validate();

        if (startDateError) {
            response.err = startDateError;
            response.code = 400; //Bad Request
            return response;
        }

        // validation end date
        var endDateValidation = new BaseValidator(end);
        endDateValidation = new IsSalonTime(endDateValidation, ErrorMessage.InvalidEndDate);
        endDateValidation = new IsAfterSecondDate(endDateValidation, ErrorMessage.EndDateIsBeforeStartDate, start);
        var endDateError = await endDateValidation.validate();

        if (endDateError) {
            response.err = endDateError;
            response.code = 400; //Bad Request
            return response;
        }



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
     * 
     * Step 1: call this.getWeeklyScheduleRecord(date) to get WeeklyDayData[]
     * Step 2: check the returned value in step 1 and return the proper reponse.
     * @returns {Promise<SalonCloudResponse<WeeklyScheduleData>>}
     * 
     * @memberOf Schedule
     */
    public async getWeeklySchedule(): Promise<SalonCloudResponse<WeeklyScheduleData>> {
        var response: SalonCloudResponse<WeeklyScheduleData> = {
            code: null,
            data: null,
            err: null
        };

        var commonValidation = await this.validateCommon();
        if (commonValidation) {
            return commonValidation;
        }


        var resultReturn: WeeklyScheduleData = {
            salon_id: null,
            employee_id: null,
            week: null
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

            response.err = null;
            response.code = 200;
            response.data = resultReturn;
        } else {
            response.err = ErrorMessage.ServerError;
            response.code = 500;
            response.data = null;
        }
        return response;
    }

    /**
     * Step 1: validation;
     * Step 2: check docs existence by calling this.checkDailySchedule(dailySchedule)
     * Step 3: if docs exists: call this.updateDailySchedule(dailySchedule);
             if docs does not exist: call this.addDailySchedule(dailySchedule);
     * Step 4: check result form step 3 and return proper response;
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<SalonCloudResponse<IDailyScheduleData>>}
     * 
     * @memberOf Schedule
     */
    public async saveDailySchedule(dailySchedule: DailyDayData): Promise<SalonCloudResponse<IDailyScheduleData>> {
        var response: SalonCloudResponse<IDailyScheduleData> = {
            code: null,
            data: null,
            err: null
        };

        var commonValidation = await this.validateCommon();
        if (commonValidation) {
            return commonValidation;
        }

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
            saveStatus = null;
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
            response.err = null;
        } else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }

        return response;
    }

    /**
     * Step 1: validation;
     * Step 2: check docs existence by calling this.checkWeeklySchedule(weeklyScheduleList)
     * Step 3: if docs exists: call this.updateDailySchedule(weeklyScheduleList);
             if docs does not exist: call this.addDailySchedule(weeklyScheduleList);
     * Step 4: check result form step 3 and return proper response;
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<SalonCloudResponse<IWeeklyScheduleData>>}
     * 
     * @memberOf Schedule
     */
    public async saveWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<SalonCloudResponse<IWeeklyScheduleData>> {
        var response: SalonCloudResponse<IWeeklyScheduleData> = {
            code: null,
            data: null,
            err: null
        };

        var commonValidation = await this.validateCommon();
        if (commonValidation) {
            return commonValidation;
        }

        var saveStatus;

        //Step 1: validation
        var errorReturn = await this.weeklyScheduleValidation(weeklyScheduleList);
        if (errorReturn) {
            response.code = 400;
            response.err = errorReturn;
            return response;
        }
        //check docs existence: yes>>>process update, no>>>> procee add
        var oldWeeklySchedule = await this.scheduleDatabase.getWeeklySchedule(this.employeeId);

        if (oldWeeklySchedule) {
            saveStatus = await this.updateWeeklySchedule(weeklyScheduleList);
        } else {
            saveStatus = await this.addWeeklySchedule(weeklyScheduleList);
        }


        response.data = saveStatus.data;
        if (!saveStatus.err) {
            response.code = 200;
            response.err = null;
        } else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        return response;
    }

    /**
     * @name: addWeeklySchedule(weeklyScheduleList: WeeklyDayData[])
     * @parameter: {weeklyScheduleList: WeeklyDayData[]}
     * @return: a promise resolved to SalonCloudResponse<boolean>
     * Step 1: create new docs of WeeklyScheduleModel with salonId, employeeId, and weeklyScheduleList
     * Step 2: return true if success
     *         return error if fail
     */
    private async addWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<SalonCloudResponse<IWeeklyScheduleData>> {
        var returnResult: SalonCloudResponse<IWeeklyScheduleData> = {
            code: null,
            err: null,
            data: null,
        };
        try {
            var rs = await this.scheduleDatabase.saveWeeklySchedule(this.employeeId, weeklyScheduleList);
            returnResult.code = 200;
            returnResult.data = rs;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }

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
    private async updateWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<SalonCloudResponse<IWeeklyScheduleData>> {
        var returnResult: SalonCloudResponse<IWeeklyScheduleData> = {
            code: null,
            data: null,
            err: null
        };
        try {
            var rs = await this.scheduleDatabase.updateWeeklySchedule(this.employeeId, weeklyScheduleList);
            returnResult.code = 200;
            returnResult.data = rs;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }

        return returnResult;
    };

    /**
     * @name: weeklyScheduleValidation(weeklyScheduleList: WeeklyDayData[])
     * @parameter: {weeklyScheduleList: WeeklyDayData[]}
     * @return: error if any
     * Use Validator in core
     */
    private async weeklyScheduleValidation(weeklyScheduleList: WeeklyDayData[]) {
        var errorReturn: any = null;

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
            err: null,
            code: null,
            data: null
        }
        try {
            var result = await this.scheduleDatabase.getDailySchedule(this.employeeId, dailySchedule.date, dailySchedule.date);
            returnResult.code = 200;
            returnResult.data = result.length > 0 ? true : false;

        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }
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
            code: null,
            err: null,
            data: null,
        };

        try {
            returnResult.data = await this.scheduleDatabase.saveDailySchedule(this.employeeId, dailySchedule);
            returnResult.code = 200;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }
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
    private async updateDailySchedule(dailySchedule: DailyDayData): Promise<SalonCloudResponse<IDailyScheduleData>> {
        var returnResult: SalonCloudResponse<IDailyScheduleData> = {
            code: null,
            data: null,
            err: null
        };
        try {
            returnResult.data = await this.scheduleDatabase.updateDailySchedule(this.employeeId, dailySchedule);
            returnResult.code = 200;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }
        return returnResult;
    };

    /**
     * @name: dailyScheduleValidation(dailySchedule: DailyDayData))
     * @parameter: {dailySchedule: DailyDayData}
     * @return: error if any
     * Use Validator in core
     */
    private async dailyScheduleValidation(dailySchedule: DailyDayData) {
        var errorReturn: any = null;

        // validation start date
        var dateValidation = new BaseValidator(dailySchedule.date);
        dateValidation = new IsSalonTime(dateValidation, ErrorMessage.InvalidDate);
        var dateError = await dateValidation.validate();

        if (dateError) {
            return errorReturn = dateError;
        }

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

        return errorReturn;
    };

    /**
     * @name: getDailyScheduleRecord(date: Date)
     * @parameter: {date: Date}
     * @return: a promise resolved to SalonCloudResponse<DailyDayData>
     * Step 1: find docs of DailyScheduleModel with salonId, employeeId, and date
     * Step 2: return err if fail
     *         return null if docs not found
     *         return docs.day date if found
     */
    protected async getDailyScheduleRecord(startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var returnResult: IDailyScheduleData[] = null;
        try {
            var returnResult = await this.scheduleDatabase.getDailySchedule(this.employeeId, startDate, endDate);
        } catch (error) {
            throw error;
        }
        return returnResult;

    }

    /**
     * @name: getWeeklyScheduleRecord()
     * @parameter: {}
     * @return: a promise resolved to SalonCloudResponse<WeeklyDayData[]>
     * Step 1: find docs of WeeklyScheduleModel with salonId, employeeId
     * Step 2: return err if fail
     *         return null if docs not found
     *         return docs.day date if found
     */
    protected async getWeeklyScheduleRecord(): Promise<WeeklyDayData[]> {
        try {
            var rs = await this.scheduleDatabase.getWeeklySchedule(this.employeeId);
            if (rs) {
                return rs.week;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }


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

        var startSalonTime = new SalonTime();
        startDate = startSalonTime.setString(startDate.toString());
        var endSalonTime = new SalonTime();
        endDate = endSalonTime.setString(endDate.toString());
        var targetSchedule: DailyDayData[] = [];
        var weeklyScheduleArray: WeeklyDayData[] = await this.getWeeklyScheduleRecord();

        var dailyScheduleArray: IDailyScheduleData[] = await this.getDailyScheduleRecord(startDate, endDate);

        var dailyScheduleArrayCount: number = 0;

        // convert to Date
        var start = new Date(startDate.timestamp);
        var end = new Date(endDate.timestamp);

        for (var date = start, count = 0; date <= end; date.setUTCDate(date.getUTCDate() + 1), count++) {
            var dailySchedule = null;
            if (dailyScheduleArrayCount < dailyScheduleArray.length) {
                dailySchedule = dailyScheduleArray[dailyScheduleArrayCount];
                dailySchedule.day.date.date.setUTCHours(0, 0, 0, 0);

            }

            date.setUTCHours(0, 0, 0, 0);
            targetSchedule[count] = {
                open: null,
                close: null,
                status: null,
                date: null
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
                } else {
                    console.log('TODO: WeekScheduleArray null!');
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

    /**
     * 
     * 
     * @protected
     * @returns {Promise<SalonCloudResponse<any>>}
     * 
     * @memberOf Schedule
     */
    protected async validateCommon(): Promise<SalonCloudResponse<null>> {
        var response: SalonCloudResponse<any> = {
            code: null,
            err: null,
            data: null
        };

        // validation salonId
        var salonIdValidation = new BaseValidator(this.salonId);
        salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.SalonNotFound);
        salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
        var salonIdError = await salonIdValidation.validate();

        if (salonIdError) {
            response.err = salonIdError;
            response.code = 400; //Bad Request
            return response;
        }
        var extValidation = await this.validateExt();

        return extValidation;
    }

    protected abstract normalizeDailySchedule(dailySchedule: DailyDayData[]);
    protected abstract normalizeWeeklySchedule(weeklySchedule: WeeklyDayData[]);
    protected abstract validateExt(): Promise<SalonCloudResponse<null>>;
}