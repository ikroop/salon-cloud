/**
 * 
 * 
 * 
 */
import { mongoose } from "./../../services/database";

export interface UserProfile {
    address?: string;
    birthday?: string;
    cash_rate?: number;
    fullname: string;
    nickname: string;
    role: number;
    salary_rate?: number;
    salon_id: string;
    social_security_number?: string;
    status: boolean;
}

export interface UserData {
    is_temporary: boolean;
    is_verified: boolean;
    profile?: [UserProfile];
    status: boolean;
    // Todo: add phone and email, not requided field
    username: string;
}

export interface IUserData extends UserData, mongoose.Document, mongoose.PassportLocalDocument { };   
