 /**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

var errorMessage = require('./../ErrorMessage');
//Parent Validator;
export abstract class Validator {
    public targetElement: any;
    public abstract validate (): any;
}


//base validator with the only mission to test existence of Target Element;
export class BaseValidator extends Validator {

    public errorType: any;    //The error that method validate() will return if validation fails.

    constructor (targetElement: any){
        super();
        this.targetElement = targetElement;

    }
    public validate (): any{
        
        return undefined;

    }
}

//Abstract decorator class: each subclass of this class carries a validating mission;
export abstract class DecoratingValidator extends Validator {
    public wrapedValidator: Validator;

    public async validate (){
         let error: any = await this.wrapedValidator.validate();
        if(error!==undefined){
            return error;
        }else{
            error = await this.validatingOperation();
            return error;
        }
        
    };

    public abstract validatingOperation();
}


