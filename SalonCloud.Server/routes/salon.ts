/*
 * Salon REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import {Validator} from '../core/validator/Validator';

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
                console.log(ErrorMessage.MissingPhoneNumber);
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

        }
    }
}
export = route.SalonRoute;