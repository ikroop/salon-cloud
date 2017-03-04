/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

export const ErrorMessage = {
    'MissingUsername': {
        'err': {
            'name': 'MissingUsername',
            'message': 'A required username is missing'
        }
    },
    'MissingPassword': {
        'err': {
            'name': 'MissingPassword',
            'message': 'A required password is missing!'
        }
    },
    'MissingFullName': {
        'err': {
            'name': 'MissingFullName',
            'message': 'A required fullname is missing!'
        }
    },
    'MissingNickName': {
        'err': {
            'name': 'MissingNickName',
            'message': 'A required nickname is missing!'
        }
    },
    'InvalidNameString': {
        'err': {
            'name': 'InvalidNameString',
            'message': 'A name should not only contain blank space(s) and is not longer than 30 characters!'
        }
    },
    'PasswordTooShort': {
        'err': {
            'name': 'PasswordTooShort',
            'message': 'A password is too short!'
        }
    },
    'NotEmailOrPhoneNumber': {
        'err': {
            'name': 'NotEmailOrPhoneNumber',
            'message': 'Username must be email or phone number!'
        }
    },
    'UsernameAlreadyExists': {
        'err': {
            'name': 'UsernameAlreadyExists',
            'message': 'Username is already existing'
        }
    },
    'InvalidTokenError': {
        'err': {
            'name': 'InvalidTokenError',
            'message': 'Token is invalid'
        }
    },
    'NoPermission': {
        'err': {
            'name': 'NoPermission',
            'message': 'Unauthorized'
        }
    },
    'WrongBirthdayFormat': {
        'err': {
            'name': 'WrongBirthdayFormat',
            'message': 'A birthday is wrong format!'
        }
    },
    'WrongAddressFormat': {
        'err': {
            'name': 'WrongAddressFormat',
            'message': 'A address is wrong format!'
        }
    },
    'SalaryRateRangeError': {
        'err': {
            'name': 'SalaryRateRangeError',
            'message': 'Salary rate must be not less than 0 nor greater than 10'
        }
    },
    'CashRateRangeError': {
        'err': {
            'name': 'CashRateRangeError',
            'message': 'Cash rate must be not less than 0 nor greater than 10'
        }
    },
    'UserNotFound': {
        'err': {
            'name': 'UserNotFound',
            'message': 'User is not found'
        }
    },
    'SalonNotFound': {
        'err': {
            'name': 'SalonNotFound',
            'message': 'Salon is not found'
        }
    },
    'MissingSalonName': {
        'err': {
            'name': 'MissingSalonName',
            'message': 'A required salonname is missing!'
        }
    },
    'MissingAddress': {
        'err': {
            'name': 'MissingAddress',
            'message': 'A required address is missing!'
        }
    },
    'MissingPhoneNumber': {
        'err': {
            'name': 'MissingPhoneNumber',
            'message': 'A required phone number is missing!'
        }
    },
    'WrongPhoneNumberFormat': {
        'err': {
            'name': 'WrongPhoneNumberFormat',
            'message': 'Phonenumber format is wrong'
        }
    },
    'WrongEmailFormat': {
        'err': {
            'name': 'WrongEmailFormat',
            'message': 'Email format is wrong'
        }
    },
    'MissingStartDate': {
        'err': {
            'name': 'MissingStartDate',
            'message': 'A required start-date is missing!'
        }
    },
    'InvalidStartDate': {
        'err': {
            'name': 'InvalidStartDate',
            'message': 'start-date param is an invalid date!'
        }
    },
    'MissingEndDate': {
        'err': {
            'name': 'MissingEndDate',
            'message': 'A required end-date is missing!'
        }
    },
    'InvalidEndDate': {
        'err': {
            'name': 'InvalidEndDate',
            'message': 'end-date param is an invalid date!'
        }
    },
    'EndDateLessThanStartDate': {
        'err': {
            'name': 'EndDateLessThanStartDate',
            'message': 'End Date Less Than Start Date'
        }
    },
    'MissingEmployeeId': {
        'err': {
            'name': 'MissingEmployeeId',
            'message': 'EmployeeId is required!'
        }
    },
    'EmployeeNotFound': {
        'err': {
            'name': 'EmployeeNotFound',
            'message': 'Employee is not found'
        }
    },
    'SignInFailed': {
        'err': {
            'name': 'SignInFailed',
            'message': 'Username or password is wrong'
        }
    },
    'ServerError': {
        'err': {
            'name': 'ServerError',
            'message': 'Internal Server Error'
        }
    },
    'MissingScheduleStatus': {
        'err': {
            'name': 'MissingScheduleStatus',
            'message': 'Schedule status is required!',
        }
    },
    'MissingScheduleOpenTime': {
        'err': {
            'name': 'MissingScheduleOpenTime',
            'message': 'Schedule open time is required!'
        }
    },
    'MissingScheduleCloseTime': {
        'err': {
            'name': 'MissingScheduleCloseTime',
            'message': 'Schedule close time is required!'
        }
    },
    'MissingScheduleDayOfWeek': {
        'err': {
            'name': 'MissingScheduleDayOfWeek',
            'message': 'Schedule day of week is required!'
        }
    },
    'InvalidScheduleOpenTime': {
        'err': {
            'name': 'InvalidScheduleOpenTime',
            'message': 'Open time value must be number range from 0 to 24*3600 = 86400!'
        }
    },
    'InvalidScheduleCloseTime': {
        'err': {
            'name': 'InvalidScheduleCloseTime',
            'message': 'Close time value must be number range from 0 to 24*3600 = 86400!'
        }
    },
    'OpenTimeGreaterThanCloseTime': {
        'err': {
            'name': 'OpenTimeGreaterThanCloseTime',
            'message': 'Close time must be greater than open time!'
        }
    },
    'InvalidScheduleDayOfWeek': {
        'err': {
            'name': 'InvalidScheduleDayOfWeek',
            'message': 'Weekday must be integer and range from 0 to 6!'
        }
    },
    'MissingScheduleDate': {
        'err': {
            'name': 'MissingScheduleDate',
            'message': 'Schedule date is required!'
        }
    },
    'InvalidScheduleDate': {
        'err': {
            'name': 'InvalidScheduleDate',
            'message': 'Invalid Schedule Date!'
        }
    },
    'MissingSalonId': {
        'err': {
            'name': 'MissingSalonId',
            'message': 'Salon Id is required'
        }
    },
    'WrongIdFormat': {
        'err': {
            'name': 'WrongIdFormat',
            'message': ' Id must be a single String of 12 bytes or a string of 24 hex characters'
        }
    },
    'MissingStatus': {
        'err': {
            'name': 'MissingStatus',
            'message': 'Status is required'
        }
    },
    'MissingRole': {
        'err': {
            'name': 'MissingRole',
            'message': 'Role is required'
        }
    },
    'RoleRangeError': {
        'err': {
            'name': 'RoleRangeError',
            'message': 'Role must be greater than 0 and less than 5.'
        }
    },
    'UnacceptedRoleForAddedEmployeeError': {
        'err': {
            'name': 'UnacceptedRoleForAddedEmployeeError',
            'message': 'Can only add employee with role = Manager(2) or Technician(3).'
        }
    },
    'WrongSSNFormat': {
        'err': {
            'name': 'WrongSSNFormat',
            'message': 'Social Security Number is wrong format.'
        }
    },
    'ProfileAlreadyExist': {
        'err': {
            'name': 'ProfileAlreadyExist',
            'message': 'Social Security Number is wrong format.'
        }
    },
    'WrongNumberOfDaysOfWeek': {
        'err': {
            'name': 'WrongNumberOfDaysOfWeek',
            'message': 'A weekly schedule must have 7 days!'
        }

    },
    'DuplicateDaysOfWeek': {
        'err': {
            'name': 'DuplicateDaysOfWeek',
            'message': 'day_of_week in schedules must be unique!'
        }
    },
    'MissingSalaryRate': {
        'err': {
            'name': 'MissingSalaryRate',
            'message': 'A required salary rate is missing!'
        }
    },
    'MissingCashRate': {
        'err': {
            'name': 'MissingCashRate',
            'message': 'A required cash rate is missing!'
        }
    },
    'MissingServiceName': {
        'err': {
            'name': 'MissingServiceName',
            'message': 'Service name is required!'
        }
    },
    'MissingServiceId': {
        'err': {
            'name': 'MissingServiceId',
            'message': 'Service id is required!'
        }
    },
    'ServiceNotFound': {
        'err': {
            'name': 'ServiceNotFound',
            'message': 'Service is not found!'
        }
    },
    'MissingGroupName': {
        'err': {
            'name': 'MissingGroupName',
            'message': 'Group name is required!'
        }
    },
    'MissingDescription': {
        'err': {
            'name': 'MissingDescription',
            'message': 'Description is required!'
        }
    },
    'InvalidDescriptionString': {
        'err': {
            'name': 'InvalidDescriptionString',
            'message': 'A Description should not only contain blank space(s)!'
        }
    },
    'MissingServicePrice': {
        'err': {
            'name': 'MissingServicePrice',
            'message': 'Service\'s price is required!'
        }
    },
    'ServicePriceRangeError': {
        'err': {
            'name': 'ServicePriceRangeError',
            'message': 'Service price\'s range = [0,500](dollars).'
        }
    },
    'MissingServiceTime': {
        'err': {
            'name': 'MissingServiceTime',
            'message': 'Service\'s time is required!'
        }
    },
    'InvalidServiceTime': {
        'err': {
            'name': 'InvalidServiceTime',
            'message': 'Service time\'s range = [300, 10800](seconds).'
        }
    },
    'ServiceGroupNameExisted': {
        'err': {
            'name': 'ServiceGroupNameExisted',
            'message': 'This service group name is already existed!'
        }
    },
    'MissingCustomerName': {
        'err': {
            'name': 'MissingCustomerName',
            'message': 'Customer\'s name is required!'
        }
    },
    'MissingBookedServiceList': {
        'err': {
            'name': 'MissingBookedServiceList',
            'message': 'Booked service list is required!'
        }
    },
    'MissingAppointmentTime': {
        'err': {
            'name': 'MissingAppointmentTime',
            'message': 'Time of appointment is required!'
        }
    },
    'WrongBookingTimeFormat': {
        'err': {
            'name': 'WrongBookingTimeFormat',
            'message': 'SalonTime format: yyyy-MM-dd HH:mm:ss'
        }
    },
    'AppointmentTimeNotAvailable': {
        'err': {
            'name': 'AppointmentTimeNotAvailable',
            'message': 'The time of the appointment is not available to be booked!'
        }
    },
    'BookingTimeNotAvailable': {
        'err': {
            'name': 'BookingTimeNotAvailable',
            'message': 'Booking Time is not available'
        }
    },
    'InvalidAppointmentStartTime': {
        'err': {
            'name': 'InvalidAppointmentStartTime',
            'message': 'This appointment has start time which is in the past!'
        }
    },
    'InvalidDataTypeService': {
        'err': {
            'name': 'InvalidDataTypeService',
            'message': 'The data type of services must be an array!'
        }
    },
    'InvalidDataTypeBookingTime': {
        'err': {
            'name': 'InvalidDataTypeBookingTime',
            'message': 'Invalid data type of booking time!'
        }
    },
    'MissingDate': {
        'err': {
            'name': 'MissingDate',
            'message': 'Missing Date Field'
        }
    },
    'InvalidDate': {
        'err': {
            'name': 'InvalidDate',
            'message': 'Invalid Date Field'
        }
    },
    'MissingDayOfWeek': {
        'err': {
            'name': 'MissingDayOfWeek',
            'message': 'Missing Day Of Week'
        }
    },
    'InvalidDayOfWeek': {
        'err': {
            'name': 'InvalidDayOfWeek',
            'message': 'Invalid Day Of Week'
        }
    },
    'EndDateIsBeforeStartDate': {
        'err': {
            'name': 'EndDateIsBeforeStartDate',
            'message': 'End Date Is Before Start Date'
        }
    },
    'InvalidSalonTimeData': {
        'err': {
            'name': 'InvalidSalonTimeData',
            'message': 'Salon Time Data Is Not Valid!'
        }
    },
    'MissingIsRemindedField': {
        'err': {
            'name': 'MissingIsRemindedField',
            'message': 'Is-Reminded Field Is Missing'
        }
    },
    'MissingDeviceField': {
        'err': {
            'name': 'MissingDeviceField',
            'message': 'Device Field Is Missing'
        }
    },
    'MissingTypeField': {
        'err': {
            'name': 'MissingTypeField',
            'message': 'Type Field Is Missing'
        }
    },
    'MissingCustomerId': {
        'err': {
            'name': 'MissingCustomerId',
            'message': 'Customer Id Is Missing'
        }
    },
    'MissingAppointmentItemsArray': {
        'err': {
            'name': 'MissingAppointmentItemsArray',
            'message': 'Appointment Items Array Is Missing'
        }
    },
    'MissingServiceItem': {
        'err': {
            'name': 'MissingServiceItem',
            'message': 'Service Item Is Missing'
        }
    },
    'MissingOverlappedObject': {
        'err': {
            'name': 'MissingOverlappedObject',
            'message': 'Overlapped Object Is Missing'
        }
    },
    'MissingOverlappedStatus': {
        'err': {
            'name': 'MissingOverlappedStatus',
            'message': 'Overlapped Status Is Missing'
        }
    },
    'MissingAppointmentId': {
        'err': {
            'name': 'MissingAppointmentId',
            'message': 'Appointment Id Is Missing'
        }
    },
    'EarlierAppointmentTimeThanSalonTimeOnCertainDate': {
        'err': {
            'name': 'EarlierAppointmentTimeThanSalonTimeOnCertainDate',
            'message': 'Appointment Time Is Earlier Than Salon Open Time!'
        }
    },
    'UserBlocked': {
        'err': {
            'name': 'UserBlocked',
            'message': 'User is blocked'
        }
    },
    'WrongUsernameOrPassword': {
        'err': {
            'name': 'WrongUsernameOrPassword',
            'message': 'Wrong Useranme or Password.'
        }
    },
    'MissingUserId': {
        'err': {
            'name': 'MissingUserId',
            'message': 'User id is missing.'
        }
    },
    'InvalidUserId': {
        'err': {
            'name': 'InvalidUserId',
            'messsage': 'User id is invalid.'
        }
    },
    'WrongVerificationCode': {
        'err': {
            'name': 'WrongVerificationCode',
            'messsage': 'Wrong Verification Code.'
        }
    },
    'MissingVerificationCode': {
        'err': {
            'name': 'MissingVerificationCode',
            'message': 'A verification code is required',
        }
    },
    'MissingVerificationId': {
        'err': {
            'name': 'MissingVerificationId',
            'message': 'A verification id is required',
        }
    },
    'MissingCustomToken':{
        'err': {
            'name': 'MissingCustomToken',
            'message': 'A custom token is required',
        } 
    },
    'Unauthorized':{
        'err': {
            'name': 'Unauthorized',
            'message': 'Unauthorized',
        } 
    }
};