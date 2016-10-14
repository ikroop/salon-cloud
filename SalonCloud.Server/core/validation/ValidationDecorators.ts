/*


*/
import {Validator, DecoratingValidator, BaseValidator} from "./BaseValidator";
import SalonModel = require("./../../modules/salonManagement/SalonModel");
import { ErrorMessage } from './../ErrorMessage';

//Validate if target element is missing.
//To pass the test: Target Element must not be undefined.
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
        if (this.targetElement === undefined) {
            return this.errorType;
        } else {
            return undefined;
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
        if (typeof this.targetElement !== "string") {
            return this.errorType;
        } else {
            return undefined;
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
        if (typeof this.targetElement !== "number") {
            return this.errorType;
        } else {
            return undefined;
        }
    }
}

//Validate if target element has type of string.
//To pass the test: Target Element has to be smaller than floor and bigger than ceiling.
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
            return undefined;
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
            return undefined;
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
            return undefined;
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
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!this.targetElement.match(emailReg)) {
            return this.errorType;
        } else {
            return undefined;
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
            return undefined;
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
            return undefined;
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
            return undefined;
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
            return undefined;
        }
    }
}

//WE CAN USE IsInRange VALIDATOR FOR THIS ONE INSTEAD
//Validate if target element is a salary rate.
//To pass the test: target element must be in range of 0 and 10.
/*export class IsSalaryRate extends DecoratingValidator {

    public errorType: any;
    public SalaryRate: number;

    constructor (wrapedValidator: Validator, errorType: any, SalaryRate: number){
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.SalaryRate = SalaryRate;
    }

    public validatingOperation(){
        if (this.SalaryRate <= 0 || this.SalaryRate >= 10) {
            return this.errorType;
        }else{
            return undefined;
        }
    }
}*/

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
        var k = SalonModel.findOne({ '_id': this.targetElement }).exec();
        await k.then(function (docs) {
            return undefined;
        }, function (err) {
            return this.errorType;
        });
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
            return undefined;
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
        var usernameEmailValidator = new IsEmail(usernameValidator, ErrorMessage.WrongEmailFormat);
        var usernameEmailResult = await usernameEmailValidator.validate();

        var usernamePhoneValidator = new IsPhoneNumber(usernameValidator, ErrorMessage.WrongPhoneNumberFormat);
        var usernamePhoneResult = await usernamePhoneValidator.validate();

        if (usernameEmailResult && usernamePhoneResult) {
            return this.errorType;
        } else {
            return undefined;
        }

    }

}

//Validate if a name is valid.
//Valid name string is a string which not only contains blank space(s).
export class IsLengthGreaterThan extends DecoratingValidator {
    public errorType: any;
    public targetElement: any;
    private minimumLength: number;
    constructor(wrapedValidator: Validator, errorType: any, minimumLength:number) {
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
            return undefined;
        }
    }

}


