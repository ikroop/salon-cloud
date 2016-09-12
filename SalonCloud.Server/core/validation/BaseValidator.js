/**
 *
 *
 */
"use strict";
var errorMessage = require("./../ErrorMessage");
//Parent Validator;
class Validator {
}
exports.Validator = Validator;
//base validator with the only mission to test existence of Target Element;
class BaseValidator extends Validator {
    constructor(targetElement) {
        super();
        this.targetElement = targetElement;
    }
    validate() {
        return undefined;
    }
}
exports.BaseValidator = BaseValidator;
//Abstract decorator class: each subclass of this class carries a validating mission;
class DecoratingValidator extends Validator {
    validate() {
        let error = this.wrapedValidator.validate();
        if (error !== undefined) {
            return error;
        }
        else {
            error = this.validatingOperation();
            return error;
        }
    }
    ;
}
exports.DecoratingValidator = DecoratingValidator;
//# sourceMappingURL=BaseValidator.js.map