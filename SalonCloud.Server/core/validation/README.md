Validation using decorator pattern
==================================

**Usage**

- Import BaseValidator and ValidationDecorators.
- First, instantiate a base validator with the to-be-validated element:

        let validationObject = new BaseValidator(targetElement);

- Then you can wrap decorating validator on top of another validator.
- A specific error type need to be provided in the constructor: 

        validationObject = new CheckMissing(validationObject, ErrorMessage.MissingOpenTime);
        validationObject = new IsNumber(validationObject, ErrorMessage.InvalidOpenTime);

- After the last decorating validator added, run method validate().
- The validate() method returns *a promise* resolving the error the validation catch. If its resovled value is undefined, the validtion passed.

        let result = await validationObject.validate();
        if(result === undefined){
            //pass validation;
        }else{
            //fail validation, var contain the return error;
        }




- Full Example: 

import BaseValidator from BaseValidator
import CheckMissing, IsNumber, IsInRange, IsLessThan from ValidationDecorators
import ErrorMessage
...
    //some code here
...
    let closeTime = 80000;
    let openTime = 87878;
    let validationObject = new BaseValidator(openTime, ErrorMessage.MissingOpenTime);

    //wrap validationObject with IsNumber to validate if it's number.
    validationObject = new IsNumber(validationObject, ErrorMessage.InvalidOpenTime);

    //wrap validationObject with IsInRange to validate if it's a valid open time (0->86400).
    validationObject = new IsInRange(validationObject, ErrorMessage.InvalidOpenTime, 0, 86400);

    //wrap validationObject with IsLessThan to validate if open time is smaller than close time.
    validationObject = new IsLessThan(validationObject, ErrorMessage.OpenTimeGreatorThanCloseTime, closeTime);

    let result = await validationObject.validate(); 
    
    if(result!=undefined){
        ErrorHandler(result); 
    }


***List Of Decorators***
- CheckMissing (WO, Err)
- IsString (WO, Err)
- IsNumber (WO, Err)
- IsInRange (OW, Err, floor, ceiling)
- IsGreatorThan (OW, Err, 2nd)
- IsLessThan (OW, Err, 2nd)
- IsEmail (OW, Err)
- IsPhoneNumber (OW, Err)
- IsSSn (OW, Err)
- IsInArray (OW, Err, Array)
- IsNotInArray ( OW, Err, Array)
