/*
 * Salon REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import {Validator} from '../core/validator/Validator';
import {Salon} from '../modules/salon/Salon';
import {SalonData} from '../modules/salon/SalonData';

var ErrorMessage = require('./ErrorMessage');

module route {
    export class SalonRoute {
        public static createInformation(req: express.Request, res: express.Response) {

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

            var salon = new Salon(req.user._id);

            salon.createSalonInformation(salonProfileData, function (err, code, data) {
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
export = route.SalonRoute;