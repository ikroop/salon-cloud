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
    export class UserRoute {
        public static CreateProfile(req: express.Request, res: express.Response) {
            

        }
    }
}
export = route.UserRoute;