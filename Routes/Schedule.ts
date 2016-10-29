/*
 * Schedule REST API
 */
import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');
import { Router, Request, Response } from "express";
import {Schedule} from './../Modules/Schedule/Schedule';
import {SalonSchedule} from './../Modules/Schedule/SalonSchedule';
import {EmployeeSchedule} from './../Modules/Schedule/EmployeeSchedule'

export class ScheduleRouter {
    private router: Router = Router();
    
    getRouter(): Router {

        this.router.post("/savesalonweeklyschedule", async(request: Request, response: Response) => {
           
            //Todo: call Salon (and employee if needed) static validation
            //Todo: build a factory for schedule;
            let testObject = new SalonSchedule(request.body.salon_id);
            let test  = await testObject.saveWeeklySchedule(request.body.weekly_schedules);
            response.status(200).json(test)
        });
        this.router.post("/savesalondailyschedule", async(request: Request, response: Response) => {
           
            //Todo: call Salon (and employee if needed) static validation
            //Todo: build a factory for schedule;
            let testObject = new SalonSchedule(request.body.salon_id);
            let returnResponse  = await testObject.saveDailySchedule(request.body.daily_schedule);
            response.status(200).json(returnResponse)
        });
        this.router.post("/saveemployeeweeklyschedule", async(request: Request, response: Response) => {
           
            //Todo: call Salon (and employee if needed) static validation
            //Todo: build a factory for schedule;
            let scheduleObject = new EmployeeSchedule(request.body.salon_id, request.body.employee_id);
            let test  = await scheduleObject.saveWeeklySchedule(request.body.weekly_schedules);
            response.status(200).json(test)
        });
        this.router.post("/saveemployeedailyschedule", async(request: Request, response: Response) => {
           
            //Todo: call Salon (and employee if needed) static validation
            //Todo: build a factory for schedule;
            let scheduleObject = new EmployeeSchedule(request.body.salon_id, request.body.employee_id);
            let returnResponse  = await scheduleObject.saveDailySchedule(request.body.daily_schedule);
            response.status(200).json(returnResponse)
        });
        this.router.post("/testpost", async(request: Request, response: Response) => {
            response.status(200).json({"testpost":"OK"});
        });

        return this.router;
    }
}
