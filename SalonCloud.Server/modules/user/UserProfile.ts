import * as mongoose from "mongoose";

export interface UserProfile {
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

export const UserProfileSchema = new mongoose.Schema({
    salon_id: {type: String, required: true},
    status: {type: Boolean, required: true},
    role: {type: Number, required: true},
    fullname: String,
    nickname: String,
    social_security_number: String,
    salary_rate: Number,
    cash_rate: Number,
    birthday: String,
    address: String,
    email: String
});

export const UserModel = mongoose.model<UserProfile>('Profile', UserProfileSchema);