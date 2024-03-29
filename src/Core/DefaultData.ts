/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonSetting } from './../Modules/SalonManagement/SalonData'
import { WeeklyDayData } from './../Modules/Schedule/ScheduleData'
import { ServiceItemData, ServiceGroupData } from './../Modules/ServiceManagement/ServiceData'

export const defaultSalonSetting: SalonSetting = {
    appointment_reminder: true,
    flexible_time: 15,
    technician_checkout: true,
    enable_online_booking: true
};

const defaultDay1: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 0,
};
const defaultDay2: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 1,
};
const defaultDay3: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 2,
};
const defaultDay4: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 3,
};
const defaultDay5: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 4,
};
const defaultDay6: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 5,
};
const defaultDay7: WeeklyDayData = {
    close: 72000,
    open: 36000,
    status: true,
    day_of_week: 6,
};
export const defaultWeeklySchedule: [WeeklyDayData] = [defaultDay1, defaultDay2, defaultDay3, defaultDay4, defaultDay5, defaultDay6, defaultDay7];

const regularServiceItem1: ServiceItemData = {
    name: 'Regular Pedicure',
    price: 20,
    time: 1800
}

const regularServiceItem2: ServiceItemData = {
    name: 'Regular Manicure',
    price: 15,
    time: 900
}

const gelServiceItem1: ServiceItemData = {
    name: 'Gel Pedicure',
    price: 30,
    time: 2700
}

const gelServiceItem2: ServiceItemData = {
    name: 'Gel Manicure',
    price: 25,
    time: 1800
}


export let samplesService1: ServiceGroupData = {
    name: 'Regular',
    salon_id: 'trool',
    service_list: [regularServiceItem1, regularServiceItem2],
    description: 'description regularServiceItem1'
}

export let samplesService2: ServiceGroupData = {
    name: 'Gel',
    salon_id: 'trool',
    service_list: [gelServiceItem1, gelServiceItem2],
    description: 'description regularServiceItem1'

}

export const SMALLEST_TIME_TICK: number = 15;
export const FLEXIBLE_TIME: number =15;