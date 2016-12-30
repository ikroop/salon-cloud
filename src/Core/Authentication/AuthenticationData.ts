/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

/**
 * 
 * 
 * @export
 * @interface UserToken
 */
export interface UserToken {
    user: {
        _id: string,
        username: string,
        status: boolean
    },
    auth: {
        token: string
    }
}