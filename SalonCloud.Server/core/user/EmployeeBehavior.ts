

export interface EmployeeBehavior {
    employeeScheduleDp : EmployeeSchedule;
    salonScheduleDp : SalonSchedule;

    getSalonSchedule(start : Date, end : Date) : SalonCloudResopnse<Array<DailySchedule>>;

    getSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailySchedule>>;
}