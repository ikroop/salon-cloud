/*
 * GET home page.
 */
import express = require('express');

module route {
    export class Index {
        public static index(req: express.Request, res: express.Response) {
            res.json({'Index':'Test'});
            //res.render('index', { title: "Express" });
        };        
    }


}

export = route;