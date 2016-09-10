/*


*/
import {Validator, DecoratingValidator} from "./BaseValidator";

//Validate if target element is missing.
//To pass the test: Target Element must not be undefined.
export class MissingCheck extends DecoratingValidator {

    public errorType: any;

    public MissingCheck (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        if(this.targetElement===undefined){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element has type of string.
//To pass the test: Target Element has to be string type.
export class IsString extends DecoratingValidator {

    public errorType: any;

    public IsString (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        if(typeof this.wrapedValidator.targetElement !== "string"){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element has type of number.
//To pass the test: Target Element has to be number type.
export class IsNumber extends DecoratingValidator {

    public errorType: any;

    public IsNumber (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        if(typeof this.wrapedValidator.targetElement !== "number"){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element has type of string.
//To pass the test: Target Element has to be string type.
export class IsInRange extends DecoratingValidator {

    public errorType: any;
    public floor: number;
    public ceiling: number;

    public IsInRange (wrapedValidator: Validator, errorType: any, floor: number, ceiling: number){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.floor = floor;
        this.ceiling = ceiling;
    }

    public validatingOperation(){
        if(typeof this.wrapedValidator.targetElement !== "string"){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be greater than second element.
export class IsGreaterThan extends DecoratingValidator {
 
    public errorType: any;
    public secondElement: any;      //This secondElement is specially extra for this decorator. Not all decorators have this.


    public IsGreaterThan (wrapedValidator: Validator, errorType: any, secondElement: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
    }
    public validatingOperation (){
       if(this.wrapedValidator.targetElement<= this.secondElement){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if 2 elements are in the right other.
//To pass the test: Target Element has to be less than second element.
export class IsLessThan extends DecoratingValidator {
 
    public errorType: any;
    public secondElement: any;      //This secondElement is specially extra for this decorator. Not all decorators have this.


    public IsLessThan (wrapedValidator: Validator, errorType: any, secondElement: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
    }
    public validatingOperation (){
       if(this.wrapedValidator.targetElement >= this.secondElement){
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element is an email.
//To pass the test: email Regex test returns true.
export class IsEmail extends DecoratingValidator {

    public errorType: any;

    public IsEmail (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!this.wrapedValidator.targetElement.match(emailReg)) {
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element is a phone number.
//To pass the test: phone Regex test returns true.
export class IsPhoneNumber extends DecoratingValidator {

    public errorType: any;

    public IsPhoneNumber (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        var phoneReg = /^\d{10}$/;
        if (!this.wrapedValidator.targetElement.match(phoneReg)) {
            return this.errorType;
        }else{
            return undefined;
        }
    }
}

//Validate if target element is a social security number.
//To pass the test: social security number Regex test returns true.
export class IsSSN extends DecoratingValidator {

    public errorType: any;

    public IsSSN (wrapedValidator: Validator, errorType: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
    }

    public validatingOperation(){
        var SSNReg = /^\d{9}$/;
        if (!this.wrapedValidator.targetElement.match(SSNReg)) {
            return this.errorType;
        }else{
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

    public IsSalaryRate (wrapedValidator: Validator, errorType: any, SalaryRate: number){
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



