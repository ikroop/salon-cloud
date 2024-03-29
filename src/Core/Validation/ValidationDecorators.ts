/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Validator, DecoratingValidator, BaseValidator } from './BaseValidator';

import { IServiceGroupData } from './../../Modules/ServiceManagement/ServiceData';
import { ErrorMessage } from './../ErrorMessage';
import { ServiceManagement } from './../../Modules/ServiceManagement/ServiceManagement';
import { UserManagement } from './../../Modules/UserManagement/UserManagement';
import { FirebaseSalonManagement } from './../../Services/SalonDatabase/Firebase/FirebaseSalonManagement'
import * as moment from 'moment';
import { SalonTime } from './../SalonTime/SalonTime';
import { FirebaseUserManagement } from './../../Services/UserDatabase/Firebase/FirebaseUserManagement';
//Validate if target element is missing.
//To pass the test: Target Element must not be null.
export class MissingCheck extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        if (this.targetElement === null || this.targetElement === 'undefined' || this.targetElement === undefined) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element has type of string.
//To pass the test: Target Element has to be string type.
export class IsString extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        if (typeof this.targetElement !== 'string') {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element has type of number.
//To pass the test: Target Element has to be number type.
export class IsNumber extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        if (typeof this.targetElement !== 'number') {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is in range of floor and ceiling.
//To pass the test: Target Element has to be smaller than or equal to ceiling and bigger than or equal to floor.
export class IsInRange extends DecoratingValidator {

    public errorType: any;
    public floor: number;
    public ceiling: number;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any, floor: number, ceiling: number) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.floor = floor;
        this.ceiling = ceiling;
        this.targetElement = this.wrapedValidator.targetElement;

    }

    public validatingOperation() {
        if (this.targetElement < this.floor || this.targetElement > this.ceiling) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is in range of floor and ceiling.
//To pass the test: Target Element has to be smaller than ceiling and bigger than floor.
export class IsInRangeExclusively extends DecoratingValidator {

    public errorType: any;
    public floor: number;
    public ceiling: number;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any, floor: number, ceiling: number) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.floor = floor;
        this.ceiling = ceiling;
        this.targetElement = this.wrapedValidator.targetElement;

    }

    public validatingOperation() {
        if (this.targetElement <= this.floor || this.targetElement >= this.ceiling) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be greater than second element.
export class IsGreaterThan extends DecoratingValidator {

    public errorType: any;
    public secondElement: any;      //This secondElement is specially extra for this decorator. Not all decorators have this.
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any, secondElement: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
        this.targetElement = this.wrapedValidator.targetElement;

    }
    public validatingOperation() {
        if (this.targetElement <= this.secondElement) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be less than second element.
export class IsLessThan extends DecoratingValidator {

    public errorType: any;
    public secondElement: any;      //This secondElement is specially extra for this decorator. Not all decorators have this.
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any, secondElement: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
        this.targetElement = this.wrapedValidator.targetElement;
    }
    public validatingOperation() {
        if (this.targetElement >= this.secondElement) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is an email.
//To pass the test: email Regex test returns true.
export class IsEmail extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!this.targetElement.match(emailReg)) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is a phone number.
//To pass the test: phone Regex test returns true.
export class IsPhoneNumber extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        var phoneReg = /^\d{10}$/;
        if (!this.targetElement.match(phoneReg)) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is a social security number.
//To pass the test: social security number Regex test returns true.
export class IsSSN extends DecoratingValidator {

    public errorType: any;
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        var SSNReg = /^\d{9}$/;
        if (!this.targetElement.match(SSNReg)) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is in the array.
//To pass the test: The array contains the target element.
export class IsInArray extends DecoratingValidator {
    public errorType: any;
    public usedArray: [any];
    public targetElement: any;

    constructor(wrapedValidator: Validator, errorType: any, usedArray: [any]) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.usedArray = usedArray;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        if (this.usedArray.indexOf(this.targetElement) == -1) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//Validate if target element is in the array.
//To pass the test: The array DOES NOT contain the target element.
export class IsNotInArray extends DecoratingValidator {
    public errorType: any;
    public usedArray: [any];
    public targetElement: any;
    constructor(wrapedValidator: Validator, errorType: any, usedArray: [any]) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.usedArray = usedArray;
        this.targetElement = this.wrapedValidator.targetElement;
    }

    public validatingOperation() {
        if (this.usedArray.indexOf(this.targetElement) !== -1) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

export class IsValidSalonId extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        var salonId = this.targetElement;
        // Check Id valid or not
        var salonDatabase = new FirebaseSalonManagement(salonId);

        try {
            var response = await salonDatabase.getSalonById();
            if (response && response._id) {
                return null;
            } else {
                return this.errorType;
            }
        } catch (error) {
            return this.errorType;
        }
    }
}

//Validate if a name is valid.
//Valid name string is a string which not only contains blank space(s).
export class IsValidNameString extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        let name: string = this.targetElement;
        let strimmedString: string = name.trim();
        if (strimmedString.length == 0) {
            return this.errorType;
        } else {
            return null;
        }
    }

}

//Validate if a username is valid.
//Valid username string is a email or phonenumber.
export class IsValidUserName extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        let username: string = this.targetElement;

        var usernameValidator = new BaseValidator(username);
        var usernameEmailValidator = new IsEmail(usernameValidator, ErrorMessage.WrongEmailFormat.err);
        var usernameEmailResult = await usernameEmailValidator.validate();

        var usernamePhoneValidator = new IsPhoneNumber(usernameValidator, ErrorMessage.WrongPhoneNumberFormat.err);
        var usernamePhoneResult = await usernamePhoneValidator.validate();

        if (usernameEmailResult && usernamePhoneResult) {
            return this.errorType;
        } else {
            return null;
        }

    }

}

//Validate if a name is valid.
//Valid name string is a string which not only contains blank space(s).
export class IsLengthGreaterThan extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    private minimumLength: number;
    constructor(wrapedValidator: Validator, errorType: any, minimumLength: number) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.minimumLength = minimumLength;
    };

    public async validatingOperation() {
        let name: string = this.targetElement;
        if (name.length < this.minimumLength) {
            return this.errorType;
        } else {
            return null;
        }
    }

}

// validate if service group name of a salon already existed;
// to pass test: service group name  does not exist on that salon's db;
// Note: ALWAYS RUN SALONID VALIDATION BEFORE THIS VALIDATION.

export class IsServiceGroupNameExisted extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public salonId: string
    constructor(wrapedValidator: Validator, errorType: any, salonId: string) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.salonId = salonId;
    };

    public async validatingOperation() {
        var groupName = this.targetElement;
        var salonId = this.salonId;
        var serviceManagement = new ServiceManagement(salonId);
        var response = await serviceManagement.getServiceGroupByName(groupName);
        if (response.data) {
            return this.errorType;
        } else {
            return null;
        }
    }
}

//validate if a service Id is valid
//to pass test:  service Id of the specific salon and service group can be found;
//Note: make sure salonId is valid also.
export class IsValidServiceId extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public salonId: string
    constructor(wrapedValidator: Validator, errorType: any, salonId: string) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.salonId = salonId;
    };

    public async validatingOperation() {
        var serviceId = this.targetElement;
        var salonId = this.salonId;
        // Check Id valid or not

        var serviceManagement = new ServiceManagement(salonId);
        var response = await serviceManagement.getServiceItemById(serviceId);
        if (response.data) {
            return null;
        } else {
            return this.errorType;
        }
    }
}

//validate if an employeeId is valid
//to pass test: employee docs can be found and one of the profile of the employee is of the mentioned salon.
export class IsValidEmployeeId extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public salonId: string
    constructor(wrapedValidator: Validator, errorType: any, salonId: string) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.salonId = salonId;
    };

    public async validatingOperation() {
        var employeeId = this.targetElement;
        var salonId = this.salonId;

        var userManagement = new UserManagement(this.salonId);
        try {
            var response = await userManagement.getUserById(employeeId);
            if (response && response.profile.length === 1) {
                return null;
            } else {
                return this.errorType;
            }
        } catch (error) {
            return this.errorType;
        }

    }

}

//Validate if a date string is valid.
//Valid date string is a string which has form of 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', or 'YYYY-MM-DD HH:mm'
export class IsSalonTime extends DecoratingValidator {
    public errorType: any;
    public targetElement: SalonTime;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        if (this.targetElement.isValid()) {
            return null;
        } else {
            return this.errorType;
        }
    }

}


//Validate if a date string is after another date string.
//Valid if the target date string is after the secondElement date string.
//secondElement date string must be validated before being used in this validation.
export class IsAfterSecondDate extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public secondElement: any;
    constructor(wrapedValidator: Validator, errorType: any, secondElement: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.secondElement = secondElement;
    };

    public async validatingOperation() {
        if (moment(this.targetElement).isBefore(this.secondElement)) {
            return this.errorType;
        } else {
            return null;
        }
    }

}

//Validate if a date string is after another date string.
//Valid if the target date string is after the secondElement date string.
//secondElement date string must be validated before being used in this validation.
export class IsBeforeSecondDate extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public secondElement: any;
    constructor(wrapedValidator: Validator, errorType: any, secondElement: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
        this.secondElement = secondElement;
    };

    public async validatingOperation() {
        if (moment(this.targetElement).isAfter(this.secondElement)) {
            return this.errorType;
        } else {
            return null;
        }
    }

}

//Validate if a SalonTimeData is valid.
//Valid if all the element are number type, and 0<day<31
export class IsValidSalonTimeData extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    public secondElement: any;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        var data = this.targetElement;
        var dateString = data.year + '-' + data.month + '-' + data.day + ' ' + data.hour + ':' + data.min;
        if (!moment(dateString, ["'YYYY-MM-DD HH:mm:ss'", "YYYY-MM-DD", 'YYYY-MM-DD HH:mm']).isValid()) {
            return this.errorType;
        } else {
            return null;
        }
    }

}

//Validate if a UserId is valid.
//Valid if node 'users' contain userId
export class IsValidUserId extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    constructor(wrapedValidator: Validator, errorType: any) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.targetElement = this.wrapedValidator.targetElement;
    };

    public async validatingOperation() {
        let userId: string = this.targetElement;
        var database = new FirebaseUserManagement(null);
        var validation = await database.checkUserIdExistence(userId);
        if (validation == false) {
            return this.errorType;
        } else {
            return null;
        }

    }

}




