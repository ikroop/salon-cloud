/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

export interface VerificationBehavior {

}

export abstract class Verification implements VerificationBehavior {


    public abstract sendContent(username: string, content: string);

}