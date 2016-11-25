/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import * as moment from 'moment';
import { SalonTimeData } from './SalonTimeData';

/**
 * System is built on multiple timezone for salon & customers.
 * 
 * @export
 * @class SalonTime
 */
export class SalonTime {
    private momentObject: moment.Moment;
    /**
     * Creates an instance of SalonTime.
     * 
     * @param {string} dateString
     * @constructor
     * @memberOf SalonTime
     */
    constructor(dateString: string) {
        var momentObject = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
    }

    /**
     * @description convert Date to SalonTime
     * @param {Date} date
     * 
     * @memberOf SalonTime
     */
    public SetDate(date: Date) {
        var momentObject = moment(date);
    }

    /**
     * @description add minute to object.
     * 
     * @param {number} minute
     * 
     * @memberOf SalonTime
     */
    public addMinute(minute: number) {
        this.momentObject.add(minute, 'minutes');
    }

    /**
     * @description add hour to object.
     * 
     * @param {number} hour
     * 
     * @memberOf SalonTime
     */
    public addHour(hour: number) {
        this.momentObject.add(hour, 'hours');
    }

    /**
     * @description add day to object.
     * 
     * @param {number} day
     * 
     * @memberOf SalonTime
     */
    public addDay(day: number) {
        this.momentObject.add(day, 'days');
    }

    /**
     * @description add month to object.
     * 
     * @param {number} month
     * 
     * @memberOf SalonTime
     */
    public addMonth(month: number) {
        this.momentObject.add(month, 'months');
    }

    /**
     * @description add year to object.
     * 
     * @param {number} year
     * 
     * @memberOf SalonTime
     */
    public addYear(year: number) {
        this.momentObject.add(year, 'years');
    }

    /**
     * @description set minute to object.
     * 
     * @param {number} minute
     * 
     * @memberOf SalonTime
     */
    public setMinute(minute: number) {
        this.momentObject.minute(minute);
    }

    /**
     * @description set hour to object.
     * 
     * @param {number} hour
     * 
     * @memberOf SalonTime
     */
    public setHour(hour: number) {
        this.momentObject.hour(hour);
    }

    /**
     * @description set day to object.
     * 
     * @param {number} day
     * 
     * @memberOf SalonTime
     */
    public setDay(day: number) {
        this.momentObject.day(day);
    }

    /**
     * @description set month to object.
     * 
     * @param {number} month
     * 
     * @memberOf SalonTime
     */
    public setMonth(month: number) {
        this.momentObject.month(month);
    }

    /**
     * @description set year to object.
     * 
     * @param {number} year
     * 
     * @memberOf SalonTime
     */
    public setYear(year: number) {
        this.momentObject.month(year);
    }

    /**
     * get minute
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getMinute(): number {
        return this.momentObject.minute();
    }

    /**
     * get hour
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getHour(): number {
        return this.momentObject.hour();
    }

    /**
     * get day
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getDay(): number {
        return this.momentObject.day();
    }

    /**
     * get month
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getMonth(): number {
        return this.momentObject.month();
    }

    /**
     * get year
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getYear(): number {
        return this.momentObject.year();
    }

    /**
     * @description export SalonTimeData structure.
     * 
     * @returns {SalonTimeData}
     * 
     * @memberOf SalonTime
     */
    public toSalonTime(): SalonTimeData {
        var returnData: SalonTimeData = {
            min: this.momentObject.minute(),
            hour: this.momentObject.hour(),
            day: this.momentObject.date(),
            month: this.momentObject.month(),
            year: this.momentObject.year()
        }
        return returnData;
    }
}