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


module route {
    export class EmployeeRoute {
        public static create(req: express.Request, res: express.Response) {
            

        }
    }
}
export = route.EmployeeRoute;