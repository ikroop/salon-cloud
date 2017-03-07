/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { FirebaseDocument } from './../../Services/FirebaseDocument';

export interface VerificationData{
    phone: string,
    activated: boolean,
    code: string,
    timestamp: number
}

export interface IVerificationData extends VerificationData, FirebaseDocument { };   
