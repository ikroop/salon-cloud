/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AppointmentAbstract } from './AppointmentAbstract'
import { AppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { MissingCheck, IsValidSalonId } from './../../Core/Validation/ValidationDecorators'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { ErrorMessage } from './../../Core/ErrorMessage'

export class BookingAppointment extends AppointmentAbstract {

    public async validation(appointment: AppointmentData): Promise<SalonCloudResponse<any>> {
        // validate salon_id field
        var response: SalonCloudResponse<any> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var salonIdValidator = new BaseValidator(appointment.salon_id);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.SalonNotFound);
        var salonIdResult = await salonIdValidator.validate();
        if (salonIdResult) {
            response.err = salonIdResult.err;
            response.code = 400;
            return response;
        }
        response.code = 200;
        return response;
    }

    public normalizationData(appointment: AppointmentData): AppointmentData {
        appointment.is_reminded = false;
        appointment.status = 1;
        appointment.type = 1;
        appointment.device = 1;
        return appointment;
    }
}