/**
 * 
 * 
 * 
 * 
 */

export interface UserProfile {
    _id?: string,
    salon_id: string,
    status: boolean,
    role: number,
    fullname?: string,
    nickname?: string,
    social_security_number?: string,
    salary_rate?: number,
    cash_rate?: number,
    birthday?: string,
    address?: string,
    email?: string
}

export interface UserData {
    username: string,
    password?: string,
    status: boolean,
    is_verified: boolean,
    is_temporary: boolean,
    profile?: [UserProfile]
}