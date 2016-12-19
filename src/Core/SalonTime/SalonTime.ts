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
    private momentjs: moment.Moment;
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
        this.momentjs = moment();

        if (salonTime) {
            this.momentjs.set('year', salonTime.year);
            this.momentjs.set('month', salonTime.month);
            this.momentjs.set('day', salonTime.day);
            this.momentjs.set('hour', salonTime.hour);
            this.momentjs.set('minute', salonTime.min);
            this.momentjs.set('second', 0);
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
        this.momentjs = moment.utc(dateString, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm'], true);
        if (this.momentjs.isValid()) {
            this.nomalize();
        }else{
            this.day = undefined;
            this.month = undefined;
            this.year = undefined;
            this.hour =  undefined;
            this.min = undefined;
            this.date = undefined;
        }
        return this;
    }

    /**
     * @description convert Date to SalonTime
     * @param {Date} date
     * 
     * @memberOf SalonTime
     */
    public setDate(date: Date): SalonTime {
        this.momentjs = moment.utc(date);
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
    public addMinute(minute: number): SalonTime {
        this.momentjs.add(minute, 'minutes');
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
    public addHour(hour: number): SalonTime {
        this.momentjs.add(hour, 'hours');
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
    public addDay(day: number): SalonTime {
        this.momentjs.add(day, 'days');
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
    public addMonth(month: number): SalonTime {
        this.momentjs.add(month, 'months');
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
    public addYear(year: number): SalonTime {
        this.momentjs.add(year, 'years');
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
    public setMinute(minute: number): SalonTime {
        this.momentjs.minute(minute);
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
    public setHour(hour: number): SalonTime {
        this.momentjs.hour(hour);
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
    public setDay(day: number): SalonTime {
        this.momentjs.day(day);
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
    public setMonth(month: number): SalonTime {
        this.momentjs.month(month);
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
    public setYear(year: number): SalonTime {
        this.momentjs.month(year);
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
    private nomalize(): void {
        this.min = this.momentjs.minute();
        this.hour = this.momentjs.hour();
        this.day = this.momentjs.date();
        this.month = this.momentjs.month();
        this.year = this.momentjs.year();
        this.date = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.min, 0));
    }

    /**
     * 
     * 
     * @returns {string}
     * 
     * @memberOf SalonTime
     */
    public toString(): string {
        var dateString = this.momentjs.format('YYYY-MM-DD HH:mm:ss');
        return dateString;
    }

    /**
     * 
     * 
     * @returns {boolean}
     * 
     * @memberOf SalonTime
     */
    public isValid(): boolean {
        return this.momentjs.isValid();
    }
}