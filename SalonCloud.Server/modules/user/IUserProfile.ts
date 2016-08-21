
import * as mongoose from "mongoose";

export interface IUserProfile {
    
}

export const UserProfileSchema = new mongoose.Schema({
    salon_name: { type: String, required: true },
    address: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: String
});

export const UserModel = mongoose.model<IUserProfile>('Profile', UserProfileSchema);