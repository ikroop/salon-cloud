/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { DailyScheduleData, WeeklyScheduleData, IDailyScheduleData, IWeeklyScheduleData, WeeklyDayData, DailyDayData } from './../../../Modules/Schedule/ScheduleData'
import WeeklyScheduleModel = require('./WeeklyScheduleModel');
import DailyScheduleModel = require('./DailyScheduleModel');
import { SalonTime } from './../../../Core/SalonTime/SalonTime';
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ScheduleManagementDatabaseInterface } from './../ScheduleManagementDatabaseInterface';

export class MongoScheduleManagement implements ScheduleManagementDatabaseInterface<IDailyScheduleData, IWeeklyScheduleData> {
    private salonId: string;

    constructor(salonId: string) {
        this.salonId = salonId;
    }

    public async getWeeklySchedule(employeeId: string): Promise<IWeeklyScheduleData> {
        var rs: IWeeklyScheduleData = undefined;
        await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: employeeId }).exec(function (err, docs) {
            if (err) {
                throw err;
            } else {
                rs = docs;
            }
        });
        return rs;
    }
    public async updateWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var rs: IWeeklyScheduleData = undefined;
        var docsFound = await WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: employeeId }).exec();
        docsFound.week = weeklyScheduleList;
        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs) {
            rs = docs;
        }, function (err) {
            throw err;
        });

        return rs;
    }
    public async saveWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var rs: IWeeklyScheduleData = undefined;
        var weeklySchedule = new WeeklyScheduleModel({
            salon_id: this.salonId,
            employee_id: employeeId,
            week: weeklyScheduleList,
        });
        var dataCreation = weeklySchedule.save();
        await dataCreation.then(function (docs: IWeeklyScheduleData) {
            rs = docs;
        }, function (error) {
            throw error;
        })

        return rs;
    }

    public async getDailySchedule(employeeId: string, startDate: SalonTime, endDate: SalonTime): Promise<IDailyScheduleData[]> {

        var returnResult: IDailyScheduleData[] = undefined;

        await DailyScheduleModel.find({
            salon_id: this.salonId, employee_id: employeeId, 'day.date.date': {
                $gte: startDate.date, $lte: endDate.date
            }
        }).exec(function (err, docs: IDailyScheduleData[]) {
            if (err) {
                throw err;
            } else {
                returnResult = docs;
            }
        });
        return returnResult;
    }

    public async updateDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {

        var rs: IDailyScheduleData = undefined;
        var docsFound = await DailyScheduleModel.findOne({ salon_id: this.salonId, employee_id: employeeId }).exec();

        docsFound.day = dailySchedule;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs: IDailyScheduleData) {
            rs = docs;
        }, function (err) {
            throw err;
        })

        return rs;

    }
    public async saveDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var rs: IDailyScheduleData = undefined;
        var dataCreation = DailyScheduleModel.create({
            salon_id: this.salonId,
            employee_id: employeeId,
            day: dailySchedule,
        })
        await dataCreation.then(function (docs: IDailyScheduleData) {
            rs = docs;
        }, function (error) {
            throw error;
        });

        return rs;
    }
}