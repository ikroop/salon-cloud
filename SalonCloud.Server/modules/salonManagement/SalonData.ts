//
//
//
//
//
//

export interface SalonInformation {
            salon_name: string;
        phone:{
            number:string;
            is_verified: boolean
        },
        location:{
            address: string;
            is_verified: boolean
        } 
        email?: string;

}

export interface SalonSetting {
        appointment_reminder: boolean;
        flexible_time: number;
        technician_checkout: boolean;
}
export interface SalonData{
    _id?: string,
    information:SalonInformation,
    setting: SalonSetting,
    
}