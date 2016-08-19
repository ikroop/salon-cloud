/*
 * Salon REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');

var ErrorMessage = require('./ErrorMessage');

var Authentication = require('../modules/salon/Salon');


module route {
    export class SalonRoute {
        public static CreateInformation(req: express.Request, res: express.Response) {
            if (!req.body.salon_name) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingSalonName);
            } 
        }
    }
}
export = route.SalonRoute;