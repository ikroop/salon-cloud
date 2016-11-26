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
export class SalonTime implements SalonTimeData {
    private momentObject: moment.Moment;
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public min: number;
    public date: Date;

    /**
     * Creates an instance of SalonTime.
     * 
     * @param {string} dateString
     * @constructor
     * @memberOf SalonTime
     */
    constructor(salonTime: SalonTimeData = undefined) {
        this.momentObject = moment();

        if (salonTime) {
            this.momentObject.set('year', salonTime.year);
            this.momentObject.set('month', salonTime.month);
            this.momentObject.set('day', salonTime.day);
            this.momentObject.set('hour', salonTime.hour);
            this.momentObject.set('minute', salonTime.min);
            this.momentObject.set('second', 0);
        }
        this.nomalize();
    }

    /**
     * 
     * 
     * @param {string} dateString
     * 
     * @memberOf SalonTime
     */
    public setString(dateString: string): SalonTime {
        this.momentObject = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
        this.nomalize();
        return this;
    }

    /**
     * @description convert Date to SalonTime
     * @param {Date} date
     * 
     * @memberOf SalonTime
     */
    public setDate(date: Date): SalonTime {
        this.momentObject = moment(date);
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
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
        this.nomalize();
        return this;
    }

    /**
     * get minute
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getMinute(): number {
        return this.min;
    }

    /**
     * get hour
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getHour(): number {
        return this.hour;
    }

    /**
     * get day
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getDay(): number {
        return this.day;
    }

    /**
     * get month
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getMonth(): number {
        return this.month;
    }

    /**
     * get year
     * 
     * @returns {number}
     * 
     * @memberOf SalonTime
     */
    public getYear(): number {
        return this.year;
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf SalonTime
     */
    private nomalize() {
        this.min = this.momentObject.minute();
        this.hour = this.momentObject.hour();
        this.day = this.momentObject.date();
        this.month = this.momentObject.month();
        this.year = this.momentObject.year();
        this.date = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.min, 0));
        console.log('OOOOOOO: ',this.date.getUTCHours());
    }
}