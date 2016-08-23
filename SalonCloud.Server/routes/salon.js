"use strict";
const Salon_1 = require('../modules/salon/Salon');
var ErrorMessage = require('./ErrorMessage');
var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    class SalonRoute {
        static createInformation(req, res) {
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
                    },
                    email: req.body.email
                },
                setting: {
                    appointment_reminder: true,
                    flexible_time: 900,
                    technician_checkout: false
                }
            };
            var salon = new Salon_1.Salon(req.user.id);
            salon.createSalonInformation(salonProfileData, function (err, code, data) {
                res.statusCode = code;
                if (err) {
                    return res.json(err);
                }
                else {
                    return res.json(data);
                }
            });
        }
    }
    route.SalonRoute = SalonRoute;
})(route || (route = {}));
module.exports = route.SalonRoute;
//# sourceMappingURL=salon.js.map