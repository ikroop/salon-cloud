


export interface UserProfile{
    address: string;
    birthday: string;
    cash_rate: number;
    fullname: string;
    nickname: string;
    role: number;
    salary_rate: number;
    salon_id: string;
    social_security_number: string;
    status: boolean;
}

export interface UserData{
    _id?: string;
    is_temporary: string;
    is_verified: string;
    password: string;
    profile: [UserProfile];
    status: boolean;
    username: string;

}