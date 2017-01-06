/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { AppointmentAbstract } from './AppointmentAbstract'
import { AppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { MissingCheck, IsValidSalonId, IsValidEmployeeId, IsSalonTime } from './../../Core/Validation/ValidationDecorators'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { ErrorMessage } from './../../Core/ErrorMessage'

export class BookingAppointment extends AppointmentAbstract {

    public async validation(appointment: AppointmentData): Promise<SalonCloudResponse<any>> {
        // validate salon_id field
        var response: SalonCloudResponse<any> = {
            data: null,
            code: null,
            err: null
        }
        var salonIdValidator = new BaseValidator(appointment.salon_id);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.SalonNotFound);
        var salonIdResult = await salonIdValidator.validate();
        if (salonIdResult) {
            response.err = salonIdResult;
            response.code = 400;
            return response;
        }

        var isRemindedValidator = new BaseValidator(appointment.is_reminded);
        isRemindedValidator = new MissingCheck(isRemindedValidator, ErrorMessage.MissingIsRemindedField);
        var isRemindedError = await isRemindedValidator.validate();
        if (isRemindedError) {
            response.err = isRemindedError;
            response.code = 400;
            return response;
        }

        var deviceValidator = new BaseValidator(appointment.device);
        deviceValidator = new MissingCheck(deviceValidator, ErrorMessage.MissingDeviceField);
        var deviceError = await deviceValidator.validate();
        if (deviceError) {
            response.err = deviceError;
            response.code = 400;
            return response;
        }

        var statusValidator = new BaseValidator(appointment.status);
        statusValidator = new MissingCheck(statusValidator, ErrorMessage.MissingStatus);
        var statusError = await statusValidator.validate();
        if (statusError) {
            response.err = statusError;
            response.code = 400;
            return response;
        }

        var typeValidator = new BaseValidator(appointment.type);
        typeValidator = new MissingCheck(typeValidator, ErrorMessage.MissingTypeField);
        var typeError = await typeValidator.validate();
        if (typeError) {
            response.err = typeError;
            response.code = 400;
            return response;
        }

        var customerIdValidator = new BaseValidator(appointment.customer_id);
        customerIdValidator = new MissingCheck(customerIdValidator, ErrorMessage.MissingCustomerId);
        var customerIdError = await customerIdValidator.validate();
        if (customerIdError) {
            response.err = customerIdError;
            response.code = 400;
            return response;
        }

        var serviceValidation = await this.validateServices(appointment.appointment_items);
        if (serviceValidation.err){
            response.err = serviceValidation.err;
            response.code = serviceValidation.code;
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