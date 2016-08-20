SalonCloud.Server
=================

API References
==============

[REST API References on
Confluence](https://smisyteam.atlassian.net/wiki/display/SC/REST+API+References)

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
$ mocha ./spec/authentication.spec.js
# Test all files in spec folder
$ mocha ./spec
```

Generate Secret Key 
=============
```
$ ssh-keygen
$ openssl rsa -in private_key_filename -pubout -outform PEM -out public_key_output_filename
```
