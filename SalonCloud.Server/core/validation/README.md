Validation using decorator pattern
==================================

**Usage**

- Import BaseValidator and ValidationDecorators.
- First, instantiate a base validator with the to-be-validated element and a Missing-type error type (This must be Missing-type error).
- Then you can add decorators on top of the base validator for various error.

- Example: 

import BaseValidator from BaseValidator
import IsNumber, IsInRange, IsLessThan from ValidationDecorators
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

    let result = validationObject.validate(); 
    
    if(result!=undefined){
        return result;
    }


***List Of Decorators***
- IsString(WO, Err)
- IsNumber(WO, Err)
- IsInRange(OW, Err, 2nd, 3rd)
- IsGreatorThan(OW, Err, 2nd)
- IsLessThan (OW, Err, 2nd)
- IsEmail (OW, Err)
- IsPhoneNumber (OW, Err)
- IsSSn (OW, Err)
