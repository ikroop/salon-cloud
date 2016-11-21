/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

/**
 * 
 * 
 * @export
 * @interface EmployeeInput
 */
export interface EmployeeInput {
    salon_id: string,
    role: number,
    phone: string,
    fullname: string,
    nickname: string,
    salary_rate: number,
    cash_rate: number,
    social_security_number?: string
}

/**
 * 
 * 
 * @export
 * @interface EmployeeReturn
 */
export interface EmployeeReturn {
    uid: string,
    salon_id: string,
    username: string,
    phone: string,
    fullname: string,
    role: number
}