
import {SalonSetting} from './../modules/salonManagement/SalonData'
import {WeeklyDayData} from './../modules/schedule/ScheduleData'

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
    }]
