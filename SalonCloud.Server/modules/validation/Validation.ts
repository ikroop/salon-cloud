/**
 * 
 * 
 */
var ErrorMessage = require('./../../routes/ErrorMessage');


//Parent Validator;
export abstract class Validator {
    public targetElement: any;
    public abstract validate (): Array<any>;
}


//base validator with the only mission to test existence of Target Element;
export class BaseValidator extends Validator {

    public errorType: any;    //The error that method validate will return if validation fails.

    public BaseValidator(targetElement: any, errorType: any){
        this.targetElement = targetElement;
        this.errorType = errorType;

    }
    public validate (): Array<any>{
        let errorList: Array<any> = [];
        if(this.targetElement===undefined){
            errorList.push(this.errorType);
        }
        return errorList;

    }
}

//Abstract decorator class: each subclass of this class carries a validating mission;
export abstract class DecoratingValidator extends Validator {
    public abstract validate ();
}


//This class is 1 of many decorators;
export class StartTimeGreaterThanEndTime extends DecoratingValidator {
    public wrapedValidator: Validator;
    public errorType: any;

    public secondElement: any;      //This secondElement is specially extra for this decorator. Not all decorators have this.


    public TargetTimeNotGreaterThanStartingTime(wrapedValidator: Validator, errorType: any, secondElement: any){
        this.wrapedValidator = wrapedValidator;
        this.errorType = errorType;
        this.secondElement = secondElement;
    }
    public validate (){
        let errorList: Array<any> = this.wrapedValidator.validate();
        if(errorList.length > 0){
            return errorList;
        }
        if(this.wrapedValidator.targetElement<= this.secondElement){
            errorList.push(this.errorType);
            return errorList;
        }
    }
}