/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { IVerificationData } from './../../Core/Verification/VerificationData'

export interface VerificationDatabaseInterface {
    generateVerification(phone:string, code:string): Promise<IVerificationData>;
    getVerification(id:string, phone:string, code:string): Promise<IVerificationData>;
}