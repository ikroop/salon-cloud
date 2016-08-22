//
//
//
//
//
//
export interface SalonProfile{
    _id?: string,
    information:{
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
    },
    setting:{
        appointment_reminder: boolean;
        flexible_time: number;
        technician_checkout: boolean;
    }
    
}