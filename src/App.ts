import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as http from 'http';

import { ScheduleRouter } from './Routes/Schedule';
import { AuthenticationRouter } from './Routes/Authentication';
import { EmployeeManagementRouter } from './Routes/EmployeeManagement';
import { SalonManagementRouter } from './Routes/SalonManagement';
import { ServiceManagementRouter } from './Routes/ServiceManagement';
import { AppointmentManagementRouter } from './Routes/AppointmentManagement';
import { SMSRouter } from './Routes/SMS'

const app: express.Application = express();
// Configuration

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ 'name': 'SalonCloud Server' });
});

app.use((request: express.Request, response: express.Response, next: express.NextFunction): void => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/api/v1/schedule', new ScheduleRouter().getRouter());
app.use('/api/v1/authentication', new AuthenticationRouter().getRouter());
app.use('/api/v1/employee', new EmployeeManagementRouter().getRouter());
app.use('/api/v1/salon', new SalonManagementRouter().getRouter());
app.use('/api/v1/service', new ServiceManagementRouter().getRouter());
app.use('/api/v1/appointment', new AppointmentManagementRouter().getRouter());
app.use('/api/v1/sms', new SMSRouter().getRouter());

var port = process.env.PORT || 3000;

const server: http.Server = app.listen(port, function () {
    console.log('OMG!!! NO BUGS! SalonCloud server listening on port %d in %s mode', port, app.settings.env);
});

module.exports = server;