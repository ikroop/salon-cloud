SalonCloud.Server
=================
[ ![Codeship Status for thanhtruong0315/salon-cloud](https://codeship.com/projects/c2934100-7e12-0134-56d1-42c59cf9d92c/status?branch=master)](https://codeship.com/projects/181578)
API References
==============

[REST API References on
Wiki](https://github.com/thanhtruong0315/salon-cloud/wiki/REST-API-Preferences)

Global packages
=============
```
Install NodeJS v4.5 (LTS - Recommended For Most Users): https://nodejs.org/en/download/
# WINDOWS
$ npm install -g tsd typescript nodemon mocha
# MAC OS
$ sudo npm install -g tsd typescript nodemon mocha
```

Build project
=============
```
$ cd <project_path> (ex: workspace/salon-cloud/SalonCloud.Server)
$ npm install
Install DefinitelyTyped (tsd.json)
$ tsd install
Compile typescript file (tsconfig.json)
$ tsc
```
Run web server
=============
Required: 
- List all .ts files that need to be compile into a "d.ts" file, e.g: "Salon.d.ts" (in SalonCloud.Server/Modules/salon)
```
/// <reference path="Salon.ts" />
```
- Add file that "d.ts" file (e.g: "Salon.d.ts") into "files" node of "tsconfig.json" file (in SalonCloud.Server)
```
"./Modules/salon/Salon.d.ts"
```

Windows
```
$ nodemon ./app.js
Server is running at port 3000: http://localhost:3000
```
Mac OS / Linux
```
$ sudo nodemon ./app.js
Server is running at port 3000: http://localhost:3000
```
Run Unit Test
=============
```
# Test only one file in spec folder
$ mocha ./spec/Authentication.spec.js
# Test all files in spec folder
$ mocha ./spec
```

Generate Secret Key 
=============
```
$ ssh-keygen
$ openssl rsa -in private_key_filename -pubout -outform PEM -out public_key_output_filename
```
Development
============
## How to add new REST API ##
Create file in routes folder. Example [routes/salon.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/Routes/salon.ts):
```
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import {Validator} from '../Core/validator/Validator';
import {Salon} from '../Modules/salon/Salon';
import {ISalon} from '../Modules/salon/ISalon';
var ErrorMessage = require('./ErrorMessage');
var Authentication = require('../Modules/salon/Salon');
module route {
    export class SalonRoute {
        public static CreateInformation(req: express.Request, res: express.Response) {
        
            if (!req.body.salon_name) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingSalonName);

           if (!req.body.phonenumber) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingPhoneNumber);
            } else {
                if (!Validator.IsPhoneNumber(req.body.phonenumber)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.WrongPhoneNumberFormat);
                }
            }       
                 
            var salonResponse = salon.CreateSalonInformation(salonData, function (salonResponse) {
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
```
Add config to [routes.d.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/Routes/Routes.d.ts)
```
/// <reference path="salon.ts" />
```

Add function REST API to [app.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/app.ts)


Add define
```
var SalonRoute = require("./Routes/salon");
```
then
```
app.post('/salon/createinformation', AuthRoute.VerifyToken, SalonRoute.CreateInformation);
``` 
**Test your API**

Compile new ts file & run server
```
$ cd <project_path> (ex: workspace/salon-cloud/SalonCloud.Server)
$ tsc
$ sudo nodemon ./app.js
```

Use Postman and post request to server, example:
```
POST http://localhost:3000/salon/createinformation
add data to body
add access token to header if it is required.
```
## How to get access token ##
Use Postman to get access token
[Signin with email & password documentation](https://github.com/thanhtruong0315/salon-cloud/wiki/Authentication#signin-with-email--password)
## How to use mongoose ##

 1. Read [Getting Started](http://mongoosejs.com/docs/index.html)
 2. Read data structure file: [modules/salon/ISalon.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/Modules/salon/ISalon.ts)
 3. Read Logic Class: [modules/salon/Salon.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/Modules/salon/Salon.ts)
 4. Expert: [How to add Sub Docs](http://mongoosejs.com/docs/subdocs.html)

## How to async/await instead of callback function ##
 ```
 async public getSchedule(): ScheduleData {
    var Schedule = await ScheduleModel.find({}).lean().exec();
    return Schedule;
 }
 ```
 
