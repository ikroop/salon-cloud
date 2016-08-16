SalonCloud.Server
=================

API References
==============

[REST API References on
Confluence](https://smisyteam.atlassian.net/wiki/display/SC/REST+API+References)

Global packages
=============
```
$ npm install -g tsd typescript nodemon mocha
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
```
$ nodemon ./app.js
```
Run Unit Test
=============
```
$ mocha ./spec/authentication.spec.js
```
