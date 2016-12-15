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

        var isRemindedValidator = new BaseValidator(appointment.is_reminded);
        isRemindedValidator = new MissingCheck(isRemindedValidator, ErrorMessage.MissingIsRemindedField);
        var isRemindedError = await isRemindedValidator.validate();
        if (isRemindedError) {
            response.err = isRemindedError.err;
            response.code = 400;
            return response;
        }

        var deviceValidator = new BaseValidator(appointment.device);
        deviceValidator = new MissingCheck(deviceValidator, ErrorMessage.MissingDeviceField);
        var deviceError = await deviceValidator.validate();
        if (deviceError) {
            response.err = deviceError.err;
            response.code = 400;
            return response;
        }

        var statusValidator = new BaseValidator(appointment.status);
        statusValidator = new MissingCheck(statusValidator, ErrorMessage.MissingStatus);
        var statusError = await statusValidator.validate();
        if (statusError) {
            response.err = statusError.err;
            response.code = 400;
            return response;
        }

        var typeValidator = new BaseValidator(appointment.type);
        typeValidator = new MissingCheck(typeValidator, ErrorMessage.MissingTypeField);
        var typeError = await typeValidator.validate();
        if (typeError) {
            response.err = typeError.err;
            response.code = 400;
            return response;
        }

        var customerIdValidator = new BaseValidator(appointment.customer_id);
        customerIdValidator = new MissingCheck(customerIdValidator, ErrorMessage.MissingCustomerId);
        var customerIdError = await customerIdValidator.validate();
        if (customerIdError) {
            response.err = customerIdError.err;
            response.code = 400;
            return response;
        }


        var appointmentItemsArrayValidator = new BaseValidator(appointment.appointment_items);
        appointmentItemsArrayValidator = new MissingCheck(appointmentItemsArrayValidator, ErrorMessage.MissingAppointmentItemsArray);
        var appointmentItemSArrayError = await appointmentItemsArrayValidator.validate();
        if (appointmentItemSArrayError) {
            response.err = appointmentItemSArrayError.err;
            response.code = 400;
            return response;
        }

        for (var eachItem of appointment.appointment_items) {
            let employeeIdValidator = new BaseValidator(eachItem.employee_id);
            employeeIdValidator = new MissingCheck(employeeIdValidator, ErrorMessage.MissingEmployeeId);
            employeeIdValidator = new IsValidEmployeeId(employeeIdValidator,  ErrorMessage.EmployeeNotFound, appointment.salon_id);
            let employeeIdError = await employeeIdValidator.validate();
            if (employeeIdError) {
                response.err = employeeIdError.err;
                response.code = 400;
                return response;
            }

            let startValidator = new BaseValidator(eachItem.start);
            startValidator = new MissingCheck(startValidator, ErrorMessage.MissingStartDate);
            startValidator = new IsSalonTime(startValidator, ErrorMessage.InvalidDate)
            let startError = await startValidator.validate();
            if (startError) {
                response.err = startError.err;
                response.code = 400;
                return response;
            }

            let endValidator = new BaseValidator(eachItem.end);
            endValidator = new MissingCheck(endValidator, ErrorMessage.MissingEndDate);
            endValidator = new IsSalonTime(endValidator, ErrorMessage.InvalidDate)
            let endError = await endValidator.validate();
            if (endError) {
                response.err = endError.err;
                response.code = 400;
                return response;
            }

            let serviceValidator = new BaseValidator(eachItem.service);
            serviceValidator = new MissingCheck(serviceValidator, ErrorMessage.MissingServiceItem);
            let serviceError = await serviceValidator.validate();
            if (serviceError) {
                response.err = serviceError.err;
                response.code = 400;
                return response;
            }

            let serviceIdValidator = new BaseValidator(eachItem.service.service_id);
            serviceValidator = new MissingCheck(serviceIdValidator, ErrorMessage.MissingServiceId);
            let serviceIdError = await serviceIdValidator.validate();
            if (serviceIdError) {
                response.err = serviceIdError.err;
                return response;
            }

            let serviceNameValidator = new BaseValidator(eachItem.service.service_name);
            serviceValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingServiceName);
            let serviceNameError = await serviceNameValidator.validate();
            if (serviceNameError) {
                response.err = serviceNameError.err;
                return response;
            }

            let priceValidator = new BaseValidator(eachItem.service.price);
            serviceValidator = new MissingCheck(priceValidator, ErrorMessage.MissingServicePrice);
            let priceError = await priceValidator.validate();
            if (priceError) {
                response.err = priceError.err;
                return response;
            }

            let serviceTimeValidator = new BaseValidator(eachItem.service.price);
            serviceValidator = new MissingCheck(serviceTimeValidator, ErrorMessage.MissingServicePrice);
            let serviceTimeError = await serviceTimeValidator.validate();
            if (serviceTimeError) {
                response.err = serviceTimeError.err;
                return response;
            }


            let overLapValidator = new BaseValidator(eachItem.overlapped);
            overLapValidator = new MissingCheck(overLapValidator, ErrorMessage.MissingOverlappedObject);
            let overLapError = await overLapValidator.validate();
            if (overLapError) {
                response.err = overLapError.err;
                response.code = 400;
                return response;
            }

            let overlapStatusValidator = new BaseValidator(eachItem.overlapped.status);
            overlapStatusValidator = new MissingCheck(overlapStatusValidator, ErrorMessage.MissingOverlappedStatus);
            let overlapStatusError = await overlapStatusValidator.validate();
            if (overlapStatusError) {
                response.err = overlapStatusError.err;
                response.code = 400;
                return response;
            }

            if (eachItem.overlapped.status) {
                let overlapAppointmentIdValidator = new BaseValidator(eachItem.overlapped.overlapped_appointment_id);
                overlapAppointmentIdValidator = new MissingCheck(overlapAppointmentIdValidator, ErrorMessage.MissingAppointmentId);

                let overlapAppointmentIdError = await overlapAppointmentIdValidator.validate();
                if (overlapAppointmentIdError) {
                    response.err = overlapAppointmentIdError.err;
                    response.code = 500;
                    return response;
                }
            }

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