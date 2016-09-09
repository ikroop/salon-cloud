/*


*/
import {Validator, DecoratingValidator} from "./BaseValidator";


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

