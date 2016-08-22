/*
 * Salon REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import {Validator} from '../core/validator/Validator';
import {Salon} from '../modules/salon/Salon';
import {SalonProfile} from '../modules/salon/SalonProfile';

var ErrorMessage = require('./ErrorMessage');

var Authentication = require('../modules/salon/Salon');


module route {
    export class SalonRoute {
        public static CreateInformation(req: express.Request, res: express.Response) {
            if (!req.body.salon_name) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingSalonName);
            }
            if (!req.body.address) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingAddress);
            } else {
                if (!Validator.IsAdress(req.body.address)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.WrongAddressFormat);
                }
            }

            if (!req.body.phonenumber) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingPhoneNumber);
            } else {
                if (!Validator.IsPhoneNumber(req.body.phonenumber)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.WrongPhoneNumberFormat);
                }
            }

            if (req.body.email && !Validator.IsEmail(req.body.email)) {
                res.statusCode = 400;
                return res.json(ErrorMessage.WrongEmailFormat);
            }

            var salonProfileData = {
                information:{
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
                setting:{
                    appointment_reminder: true,
                    flexible_time: 900,
                    technician_checkout: false
                }                
            };

            var salon = new Salon(req.user.id);

            var salonResponse = salon.createSalonInformation(salonProfileData, function (salonResponse) {
                if (salonResponse) {
                    res.statusCode = 200;
                    return res.json(salonResponse);
                } else {
                    res.statusCode = 500;
                    return res;
                }
            });

        }
    }
}
export = route.SalonRoute;