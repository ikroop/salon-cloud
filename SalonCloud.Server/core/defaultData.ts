
import {SalonSetting} from './../modules/salonManagement/SalonData'
import {WeeklyDayData} from './../modules/schedule/ScheduleData'
import {ServiceItemData, ServiceGroupData} from './../modules/serviceManagement/ServiceData'

export const defaultSalonSetting : SalonSetting = {
    appointment_reminder: true,
    flexible_time: 15,
    technician_checkout: true,
}

export const defaultWeeklySchedule : [WeeklyDayData] = 
    [{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 0

    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 1
    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 2
    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 3
    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 4
    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 5
    },{
        close: 72000,
        open: 36000,
        status: true,
        day_of_week: 6
    }];

const regularServiceItem1 : ServiceItemData = {
    name: 'Regular Pedicure',
    price: 20,
    time: 20
}

const regularServiceItem2 : ServiceItemData = {
    name: 'Regular Manicure',
    price: 15,
    time: 15
}

const gelServiceItem1 : ServiceItemData = {
    name: 'Gel Pedicure',
    price: 30,
    time: 30
}

const gelServiceItem2 : ServiceItemData = {
    name: 'Gel Manicure',
    price: 25,
    time: 25
}


export const samplesService1 : ServiceGroupData = {
    name: 'Regular',
    salon_id: undefined,
    service_list: [regularServiceItem1, regularServiceItem2]
}

export const samplesService2 : ServiceGroupData = {
    name: 'Gel',
    salon_id: undefined,
    service_list: [gelServiceItem1,gelServiceItem2]
}

