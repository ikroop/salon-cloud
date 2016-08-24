"use strict";
const User_1 = require('../modules/User/User');
var ErrorMessage = require('./ErrorMessage');
var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    class UserRoute {
        static createProfile(req, res) {
            var BodyData = req.body;
            var UserProfile = {
                salon_id: BodyData.salon_id,
                status: BodyData.status,
                role: BodyData.role,
                fullname: BodyData.fullname,
                nickname: BodyData.nickname,
                social_security_number: BodyData.social_security_number,
                salary_rate: BodyData.salary_rate,
                cash_rate: BodyData.cash_rate,
                birthday: BodyData.birthday,
                address: BodyData.address,
                email: BodyData.email
            };
            var UserData = req.user;
            var user = new User_1.User(UserProfile.salon_id, UserData._id);
            user.createProfile(UserProfile, function (err, code, data) {
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
    route.UserRoute = UserRoute;
})(route || (route = {}));
module.exports = route.UserRoute;
//# sourceMappingURL=user.js.map