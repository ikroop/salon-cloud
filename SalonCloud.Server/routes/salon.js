"use strict";
const Validator_1 = require('../core/validator/Validator');
const Salon_1 = require('../modules/salon/Salon');
var ErrorMessage = require('./ErrorMessage');
var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    class SalonRoute {
        static createInformation(req, res) {
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
            var salonProfileData = {
                information: {
                    salon_name: req.body.salon_name,
                    location: {
                        address: req.body.address,
                        is_verified: false
                    },
                    phone: {
                        number: req.body.phonenumber,
                        is_verified: false
                    }
                },
                setting: {
                    appointment_reminder: true,
                    flexible_time: 900,
                    technician_checkout: false
                }
            };
            var salon = new Salon_1.Salon(req.user.id);
            var salonResponse = salon.createSalonInformation(salonProfileData, function (salonResponse) {
                if (salonResponse) {
                    res.statusCode = 200;
                    return res.json(salonResponse);
                }
                else {
                    res.statusCode = 500;
                    return res;
                }
            });
        }
    }
    route.SalonRoute = SalonRoute;
})(route || (route = {}));
module.exports = route.SalonRoute;
//# sourceMappingURL=salon.js.map