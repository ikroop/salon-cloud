"use strict";
const Validator_1 = require('../core/validator/Validator');
var ErrorMessage = require('./ErrorMessage');
var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    class SalonRoute {
        static CreateInformation(req, res) {
            if (!req.body.salon_name) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingSalonName);
            }
            if (!req.body.address) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingAddress);
            }
            else {
                if (!Validator_1.Validator.IsAdress(req.body.address)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.WrongAddressFormat);
                }
            }
            if (!req.body.phonenumber) {
                res.statusCode = 400;
                console.log(ErrorMessage.MissingPhoneNumber);
                return res.json(ErrorMessage.MissingPhoneNumber);
            }
            else {
                if (!Validator_1.Validator.IsPhoneNumber(req.body.phonenumber)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.WrongPhoneNumberFormat);
                }
            }
            if (req.body.email && !Validator_1.Validator.IsEmail(req.body.email)) {
                res.statusCode = 400;
                return res.json(ErrorMessage.WrongEmailFormat);
            }
        }
    }
    route.SalonRoute = SalonRoute;
})(route || (route = {}));
module.exports = route.SalonRoute;
//# sourceMappingURL=salon.js.map