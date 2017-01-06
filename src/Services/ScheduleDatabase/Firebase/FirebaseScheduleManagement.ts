/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { DailyScheduleData, WeeklyScheduleData, IDailyScheduleData, IWeeklyScheduleData, WeeklyDayData, DailyDayData } from './../../../Modules/Schedule/ScheduleData'
import { SalonTime } from './../../../Core/SalonTime/SalonTime';
import { SalonTimeData } from './../../../Core/SalonTime/SalonTimeData';
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ScheduleManagementDatabaseInterface } from './../ScheduleManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

export class FirebaseScheduleManagement implements ScheduleManagementDatabaseInterface<IDailyScheduleData, IWeeklyScheduleData> {
    private salonId: string;
    private database: any;
    private scheduleRef: any;
    private readonly SCHEDULE_KEY_NAME: string = 'schedule';
    private salonDatabase: FirebaseSalonManagement;

    /**
     * Creates an instance of FirebaseScheduleManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf FirebaseScheduleManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        this.salonDatabase = new FirebaseSalonManagement(salonId);
        var salonRef = this.salonDatabase.getSalonFirebaseRef();
        this.scheduleRef = salonRef.child(salonId + '/' + this.SCHEDULE_KEY_NAME);
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async getWeeklySchedule(employeeId: string): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        } else {
            weeklySchedule = await this.getSalonWeeklySchedule();
        }
        return weeklySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.updateEmployeeWeeklySchedule(employeeId, weeklyScheduleList);
        } else {
            weeklySchedule = await this.updateSalonWeeklySchedule(weeklyScheduleList);
        }
        return weeklySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.saveEmployeeWeeklySchedule(employeeId, weeklyScheduleList);
        } else {
            weeklySchedule = await this.saveSalonWeeklySchedule(weeklyScheduleList);
        }
        return weeklySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async getDailySchedule(employeeId: string, startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var dailySchedule: IDailyScheduleData[] = undefined;
        if (employeeId) {
            dailySchedule = await this.getEmployeeDailychedule(employeeId, startDate, endDate);
        } else {
            dailySchedule = await this.getSalonDailychedule(startDate, endDate);
        }
        return;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {


        return;

    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var dailyScheduleReturn: IDailyScheduleData = undefined;
        if (employeeId) {
            dailyScheduleReturn = await this.saveDailySchedule(employeeId, dailySchedule);
        } else {
            dailyScheduleReturn = await this.saveSalonDailySchedule(dailySchedule);
        }
        return dailyScheduleReturn;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getEmployeeWeeklySchedule(employeeId: string): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/employees/' + employeeId).orderByChild('day_of_week').once('value', async function (snapshot) {
            employeeWeeklySchedule = snapshot.val();
        });
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getSalonWeeklySchedule(): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/salon').orderByChild('day_of_week').once('value', async function (snapshot) {
            salonWeeklySchedule = snapshot.val();
        });
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async updateEmployeeWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/employees/' + employeeId).update(weeklyScheduleList);
        employeeWeeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async updateSalonWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/salon').update(weeklyScheduleList);
        salonWeeklySchedule = await this.getSalonWeeklySchedule();
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async saveEmployeeWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/employees/' + employeeId).save(weeklyScheduleList);
        employeeWeeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async saveSalonWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.child('weekly/salon').save(weeklyScheduleList);
        salonWeeklySchedule = await this.getSalonWeeklySchedule();
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getEmployeeDailychedule(employeeId: string, startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var employeeDailyScheduleList: IDailyScheduleData[] = undefined;
        await this.scheduleRef.child('daily/employees/' + employeeId).orderByChild('date/date').startAt(startDate.date).endAt(endDate.date).once('value', async function (snapshot) {
            var employeeDailySchedule: IDailyScheduleData = snapshot.val();
            employeeDailySchedule._id = snapshot.key;
            employeeDailyScheduleList.push(employeeDailySchedule);
        });
        return employeeDailyScheduleList;
    }

    /**
     * 
     * 
     * @private
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getSalonDailychedule(startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var salonDailyScheduleList: IDailyScheduleData[] = undefined;
        await this.scheduleRef.child('daily/salon').orderByChild('date/date').startAt(startDate.date).endAt(endDate.date).once('value', async function (snapshot) {
            var salonDailySchedule: IDailyScheduleData = snapshot.val();
            salonDailySchedule._id = snapshot.key;
            salonDailyScheduleList.push(salonDailySchedule);
        });
        return salonDailyScheduleList;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveEmployeeDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var employeeDailySchedule: IDailyScheduleData = undefined;
        await this.scheduleRef.child('daily/employees/' + employeeId).push().save(dailySchedule);
        employeeDailySchedule = (await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date))[0];
        return employeeDailySchedule;
    }

    /**
     * 
     * 
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveSalonDailySchedule(dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var employeeDailySchedule: IDailyScheduleData = undefined;
        await this.scheduleRef.child('daily/salon').push().save(dailySchedule);
        employeeDailySchedule = (await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date))[0];
        return employeeDailySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateEmployeeDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var oldDailyScheduleList = await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date);
        var oldDailySchedule = oldDailyScheduleList[0];
        await this.scheduleRef.child('daily/employees/' + employeeId + '/' + oldDailySchedule._id).save(dailySchedule);
        var newDailyScheduleList = await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date);
        return newDailyScheduleList[0];
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateSalonDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var oldDailyScheduleList = await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date);
        var oldDailySchedule = oldDailyScheduleList[0];
        await this.scheduleRef.child('daily/salon/' + oldDailySchedule._id).save(dailySchedule);
        var newDailyScheduleList = await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date);
        return newDailyScheduleList[0];
    }

}