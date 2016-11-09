# salon-cloud
SalonCloud – a software will change all your definition about managing a salon to a high new level.

[![Join Chat](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/salon-cloud/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![CircleCI](https://circleci.com/gh/thanhtruong0315/salon-cloud/tree/master.svg?style=shield&circle-token=581ea042d188894d25e63c087a11b4ec8ed3851a)](https://circleci.com/gh/thanhtruong0315/salon-cloud/tree/master)
[![codecov](https://codecov.io/gh/thanhtruong0315/salon-cloud/branch/master/graph/badge.svg?token=pf4UaCBhUy)](https://codecov.io/gh/thanhtruong0315/salon-cloud)

# Database Structure
[DATABASE.md](https://github.com/thanhtruong0315/salon-cloud/blob/master/DATABASE.md)

API References
==============

[REST API References on
Wiki](https://github.com/thanhtruong0315/salon-cloud/wiki/REST-API-Preferences)

Global packages
=============
```
Install NodeJS v4.5 (LTS - Recommended For Most Users): https://nodejs.org/en/download/
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

Testing
=============
```
$ cd <project_path> (ex: workspace/salon-cloud)
$ npm test
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

