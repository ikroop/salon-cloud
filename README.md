# salon-cloud
SalonCloud – a software will change all your definition about managing a salon to a high new level.

[![Join Chat](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/salon-cloud/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Build Status](https://travis-ci.org/salonhelps/salon-cloud.svg?branch=master)](https://travis-ci.org/salonhelps/salon-cloud)
[![codecov](https://codecov.io/gh/salonhelps/salon-cloud/branch/master/graph/badge.svg)](https://codecov.io/gh/salonhelps/salon-cloud)
# Overview
![Alt text](/Salon_Architecture.png "SalonCloud Overview")


# Database Structure
[DATABASE.md](https://github.com/salonhelps/salon-cloud/blob/master/FirebaseDatabase.md)

API References
==============

[REST API References on
Wiki](https://github.com/thanhtruong0315/salon-cloud/wiki/REST-API-Preferences)

| Module                    | API                              | Status       | DOC           | Issue          |
|---------------------------|----------------------------------|--------------|---------------|----------------|
| **Authentication**        |  Sign Up with Username & Password| Available    | [README][10]  |              - |
|                           |  Sign In with Username & Password| Available    | [README][11]  |              - |
|                           |  Sign In with custom token       | Inprogress   | [README][12]  |              - |
| **Schedule**              |  Get salon daily schedule        | Available    | [README][20]  |              - |
|                           |  Get salon weekly schedule       | Available    | [README][21]  |              - |
|                           |  Save Salon Daily Schedule       | Available    | [README][22]  |              - |
|                           |  Save Salon Weekly Schedule      | Available    | [README][23]  |              - |
|                           |  Get employee daily schedule     | Available    | [README][24]  |              - |
|                           |  Get employee weekly schedule    | Available    | [README][25]  |              - |
|                           |  Save Employee Daily Schedule    | Available    | [README][26]  |              - |
|                           |  Save Employee Weekly Schedule   | Available    | [README][27]  |              - |
| **Salon Management**      |  Create Salon                    | Available    | [README][30]  |              - |
|                           |  Get Salon List By User Id       | Available    | [README][31]  |              - |
|                           |  Get Salon Information           | Not Started  | [README][32]  |              - |
|                           |  Get Salon Settings              | Not Started  | [README][33]  |              - |
|                           |  Update Salon Information        | Not Started  | [README][34]  |              - |
|                           |  Update Salon Settings           | Not Started  | [README][35]  |              - |
|  **Employee Management**  |  Create Employee                 | Available    | [README][40]  |              - |
|                           |  Get Employee List               | In Progress  | [README][41]  |              - |
|                           |  Get Employee by id              | Not Started  | [README][42]  |              - |
|                           |  Update employee                 | Not Started  | [README][43]  |              - |
|                           |  Remove employee                 | Not Started  | [README][44]  |              - |
|  **Service Management**   |  Add Service                     | Available    | [README][50]  |              - |
|                           |  Update Salon Services           | Not Started  | [README][51]  |              - |
|                           |  Delete Salon Services           | Not Started  | [README][52]  |              - |
|                           |  Get Salon Services              | Not Started  | [README][53]  |              - |
|  **Appointment**          |  Create Appointment By Phone     | Available    | [README][60]  |              - |
|                           |  Get Appointment by Id           | Not Started  | [README][61]  |              - |
|                           |  Get Appointment by date         | Not Started  | [README][62]  |              - |
|                           |  Get Employee available time     | Not Started  | [README][63]  |              - |
|                           |  Book appointment online         | Not Started  | [README][64]  |              - |
|                           |  Get appointment by customer id  | Not Started  | [README][65]  |              - |
|  **Customer**             |  Customer register online        | Available    | [README][70]  |              - |
|  **SMS**                  |  Send verification code          | Available    | [README][80]  |              - |

[10]: https://github.com/salonhelps/salon-cloud/wiki/Authentication#signup-with-email--password
[11]: https://github.com/salonhelps/salon-cloud/wiki/Authentication#signin-with-email--password
[12]: https://github.com/salonhelps/salon-cloud/wiki/Authentication
[20]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#get-salon-daily-schedule
[21]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#get-salon-weekly-schedule
[22]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#save-salon-daily-schedule
[23]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#save-salon-weekly-schedule
[24]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#get-employee-daily-schedule
[25]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#get-employee-weekly-schedule
[26]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#save-employee-daily-schedule
[27]: https://github.com/salonhelps/salon-cloud/wiki/Schedule#save-employee-weekly-schedule
[30]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Management#create-salon
[31]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Management#get-salon-list-by-user-id
[32]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Managemen
[33]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Managemen
[34]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Managemen
[35]: https://github.com/salonhelps/salon-cloud/wiki/Salon-Managemen
[40]: https://github.com/salonhelps/salon-cloud/wiki/Employee-Management#create-employee
[41]: https://github.com/salonhelps/salon-cloud/wiki/Employee-Management#get-employee-list
[42]: https://github.com/salonhelps/salon-cloud/wiki/Employee-Management
[43]: https://github.com/salonhelps/salon-cloud/wiki/Employee-Management
[44]: https://github.com/salonhelps/salon-cloud/wiki/Employee-Management
[50]: https://github.com/salonhelps/salon-cloud/wiki/Service-Management#add-service
[51]: https://github.com/salonhelps/salon-cloud/wiki/Service-Management
[52]: https://github.com/salonhelps/salon-cloud/wiki/Service-Management
[53]: https://github.com/salonhelps/salon-cloud/wiki/Service-Management
[60]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management#create-appointment-by-phone
[61]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management
[62]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management
[63]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management
[64]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management
[65]: https://github.com/salonhelps/salon-cloud/wiki/Appointment-Management
[70]: https://github.com/salonhelps/salon-cloud/wiki/Customer#signup-with-phonenumber-for-customer
[80]: https://github.com/salonhelps/salon-cloud/wiki/SMS#send-verification-code

Global packages
=============
```
Install NodeJS v6.9.1 (LTS - Recommended For Most Users): https://nodejs.org/en/download/
# WINDOWS
$ npm install -g typescript nodemon mocha nyc codecov
# MAC OS
$ sudo npm install -g typescript nodemon mocha nyc codecov
```

Install dependencies
=============
```
$ cd <project_path> (ex: workspace/salon-cloud)
$ npm install
```

Build code
=============
```
$ cd <project_path> (ex: workspace/salon-cloud)
$ tsc test/*.ts --module commonjs --sourcemap --target es6
```

Testing
=============
```
$ cd <project_path> (ex: workspace/salon-cloud)
$ mocha -t 5000 test
OR
$  mocha -t 5000 test/<filename>.spec.js
```

Debug with mocha and visual studio code
=============
```
$ mocha --debug-brk -t 30000
Debug port is listening at 5858
Open Visual Studio Code -> Debug tab -> select configuration: Debug Mocha Test-> Click start icon
Note: You have to mark break point in your code.
```

Run web server
=============
```
$ cd src
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

Generate Secret Key 
=============
```
$ ssh-keygen
$ openssl rsa -in private_key_filename -pubout -outform PEM -out public_key_output_filename
```


