"use strict";
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
        }
    }
    route.SalonRoute = SalonRoute;
})(route || (route = {}));
module.exports = route.SalonRoute;
//# sourceMappingURL=salon.js.map