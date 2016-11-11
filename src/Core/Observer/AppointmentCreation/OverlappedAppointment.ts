import { AppointmentItemData } from './../../../Modules/AppointmentManagement/AppointmentData'
import AppointmentModel = require('./../../../Modules/AppointmentManagement/AppointmentModel');
import { Observable } from './../Observable'
import { Observer } from './../Observer'
import { SalonTime } from './../../SalonTime/salonTime'
import { SalonCloudResponse } from './../../SalonCloudResponse'
import { ErrorMessage } from './../../ErrorMessage'

export class OverlappedAppointment implements Observer {
    public async update(inputData: any) {
        var response: SalonCloudResponse<boolean> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var overlappedAppointmentId = inputData.overlappedAppointmentId;
        var appointmentId = inputData.appointment.Id;
        var overlappedObject = {
            status: true,
            appointment_id: appointmentId
        }
        var docsSearch = AppointmentModel.findOne({ 'appointment_items.$.id': overlappedAppointmentId }).exec();
        await docsSearch.then(async function (docs) {
            if (docs) {
                docs.appointment_items[0].overlapped = overlappedObject;
                var saveProcess = docs.save();
                await saveProcess.then(function (docs) {
                    response.data = true;
                    response.code = 200
                },
                    function (err) {
                        response.err = err;
                        response.code = 500;
                    })
            } else {
                response.err = ErrorMessage.AppointmentTimeNotAvailable; //TODO
                response.code = 500;
            }
        }, function (err) {
            response.err = err;
            response.code = 500;
        })
    }
}