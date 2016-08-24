/*
 * Salon REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import {Validator} from '../core/validator/Validator';
import {Salon} from '../modules/salon/Salon';
import {SalonProfile} from '../modules/salon/SalonProfile';
import {User} from '../modules/User/User'

var ErrorMessage = require('./ErrorMessage');

var Authentication = require('../modules/salon/Salon');


module route {
    export class UserRoute {
        public static createProfile(req: express.Request, res: express.Response) {
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
            var user = new User(UserProfile.salon_id, UserData._id);
            user.createProfile(UserProfile, function (err, code, data) {
                res.statusCode = code;
                if (err) {
                    return res.json(err);
                } else {
                    return res.json(data);
                }
            });
        }
    }
}
export = route.UserRoute;