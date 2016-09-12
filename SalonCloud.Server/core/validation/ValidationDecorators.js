"use strict";
/*


*/
const BaseValidator_1 = require("./BaseValidator");
//Validate if target element is missing.
//To pass the test: Target Element must not be undefined.
class MissingCheck extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        if (this.targetElement === undefined) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.MissingCheck = MissingCheck;
//Validate if target element has type of string.
//To pass the test: Target Element has to be string type.
class IsString extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        if (typeof this.wrapedValidator.targetElement !== "string") {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsString = IsString;
//Validate if target element has type of number.
//To pass the test: Target Element has to be number type.
class IsNumber extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        if (typeof this.wrapedValidator.targetElement !== "number") {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsNumber = IsNumber;
//Validate if target element has type of string.
//To pass the test: Target Element has to be string type.
class IsInRange extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType, floor, ceiling) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.floor = floor;
        this.ceiling = ceiling;
    }
    validatingOperation() {
        if (typeof this.wrapedValidator.targetElement !== "string") {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsInRange = IsInRange;
//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be greater than second element.
class IsGreaterThan extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType, secondElement) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
    }
    validatingOperation() {
        if (this.wrapedValidator.targetElement <= this.secondElement) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsGreaterThan = IsGreaterThan;
//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be less than second element.
class IsLessThan extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType, secondElement) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
    }
    validatingOperation() {
        if (this.wrapedValidator.targetElement >= this.secondElement) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsLessThan = IsLessThan;
//Validate if target element is an email.
//To pass the test: email Regex test returns true.
class IsEmail extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!this.wrapedValidator.targetElement.match(emailReg)) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsEmail = IsEmail;
//Validate if target element is a phone number.
//To pass the test: phone Regex test returns true.
class IsPhoneNumber extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        var phoneReg = /^\d{10}$/;
        if (!this.wrapedValidator.targetElement.match(phoneReg)) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsPhoneNumber = IsPhoneNumber;
//Validate if target element is a social security number.
//To pass the test: social security number Regex test returns true.
class IsSSN extends BaseValidator_1.DecoratingValidator {
    constructor(wrapedValidator, errorType) {
        super();
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }
    validatingOperation() {
        var SSNReg = /^\d{9}$/;
        if (!this.wrapedValidator.targetElement.match(SSNReg)) {
            return this.errorType;
        }
        else {
            return undefined;
        }
    }
}
exports.IsSSN = IsSSN;
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
//# sourceMappingURL=ValidationDecorators.js.map