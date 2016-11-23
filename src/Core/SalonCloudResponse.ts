/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

export interface SalonCloudResponse<T>{
    err: any,
    code: number,
    data: T
}