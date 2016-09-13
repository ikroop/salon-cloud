/**
 *
 *
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            let error = yield this.wrapedValidator.validate();
            if (error !== undefined) {
                return error;
            }
            else {
                error = this.validatingOperation();
                return error;
            }
        });
    }
    ;
}
exports.DecoratingValidator = DecoratingValidator;
//# sourceMappingURL=BaseValidator.js.map