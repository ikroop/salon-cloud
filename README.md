# salon-cloud
SalonCloud – a software will change all your definition about managing a salon to a high new level.

[![Join Chat](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/salon-cloud/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Build Status](https://travis-ci.org/salonhelps/salon-cloud.svg?branch=master)](https://travis-ci.org/salonhelps/salon-cloud)
[![codecov](https://codecov.io/gh/salonhelps/salon-cloud/branch/master/graph/badge.svg?token=pf4UaCBhUy)](https://codecov.io/gh/salonhelps/salon-cloud)
# Overview
![Alt text](/Salon_Architecture.png "SalonCloud Overview")


# Database Structure
[DATABASE.md](https://github.com/salonhelps/salon-cloud/blob/master/FirebaseDatabase.md)

API References
==============

[REST API References on
Wiki](https://github.com/thanhtruong0315/salon-cloud/wiki/REST-API-Preferences)

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


