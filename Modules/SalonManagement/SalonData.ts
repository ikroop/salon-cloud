//
//
//
//
//
//
import { mongoose } from './../../Services/Database';

export interface SalonInformation {
    salon_name: string;
    phone: {
        number: string;
        is_verified: boolean;
    },
    location: {
        address: string;
        is_verified: boolean;
        timezone_id?: string;
    }
    email?: string;

}

export interface SalonSetting {
    appointment_reminder: boolean;
    flexible_time: number;
    technician_checkout: boolean;
}

export interface SalonData {
    information: SalonInformation,
    setting: SalonSetting
}

export interface ISalonModel extends SalonData, mongoose.Document{}
