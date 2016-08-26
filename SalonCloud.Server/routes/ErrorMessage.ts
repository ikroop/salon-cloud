//Error Messages Definition
module.exports = {
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
            'message': 'A required FullName is missing!'
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
    'WrongSocialSecurityNumberFormat': {
        'err': {
            'name': 'WrongSocialSecurityNumberFormat',
            'message': 'Social Security Number is wrong format!'
        }
    },
    'SalaryRateRangeError': {
        'err': {
            'name': 'SalaryRateRangeError',
            'message': 'Salary rate must be greater than 0 and less than 10'
        }
    },
    'CashRateRangeError': {
        'err': {
            'name': 'CashRateRangeError',
            'message': 'Cash rate must be greater than 0 and less than 10'
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
    'InvalidEndDateForStartDate': {
        'err': {
            'name': 'InvalidEndDateForStartDate',
            'message': 'end-date is earlier than start-date!'
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
    'MissingScheduleWeekday': {
        'err': {
            'name': 'MissingScheduleWeekday',
            'message': 'Schedule weekday is required!'
        }
    },
    'InvalidScheduleOpenTime': {
        'err': {
            'name': 'InvalidScheduleOpenTime',
            'message': 'Open time value must range from 0 to 24*3600 = 86400!'
        }
    },
    'InvalidScheduleCloseTime': {
        'err': {
            'name': 'InvalidScheduleCloseTime',
            'message': 'Close time value must range from 0 to 24*3600 = 86400!'
        }
    },
    'CloseTimeGreaterThanOpenTime': {
        'err': {
            'name': 'CloseTimeGreaterThanOpenTime',
            'message': 'Close time can not be greater than open time!'
        }
    },
    'InvalidScheduleWeekday': {
        'err': {
            'name': 'InvalidScheduleWeekday',
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
    }
};