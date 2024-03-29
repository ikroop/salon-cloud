import { AppointmentItemData } from './../../../Modules/AppointmentManagement/AppointmentData'
import { Observable } from './../Observable'
import { Observer } from './../Observer'
import { SalonTime } from './../../SalonTime/SalonTime'
import { SalonCloudResponse } from './../../SalonCloudResponse'
import { ErrorMessage } from './../../ErrorMessage'

export class OverlappedAppointment implements Observer {
    public async update(inputData: any) {
        var response: SalonCloudResponse<boolean> = {
            data: null,
            code: null,
            err: null
        }
        var overlappedAppointmentId = inputData.overlappedAppointmentId;
        var appointmentId = inputData.appointment.Id;
        var overlappedObject = {
            status: true,
            appointment_id: appointmentId
        }

        // FIX ME: we have to update firebase layer;
        
        /*
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
                response.err = ErrorMessage.AppointmentTimeNotAvailable.err; //TODO
                response.code = 500;
            }
        }, function (err) {
            response.err = err;
            response.code = 500;
        })*/
    }
}