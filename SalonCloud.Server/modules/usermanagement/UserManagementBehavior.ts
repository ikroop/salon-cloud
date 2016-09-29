

export interface UserManagementBehavior{

    salon_id: string;

    addUser(phone, profile : UserProfile) : boolean;

    getProfile(employeeId : string) :UserData;

    getUserByRole(role : number) : Array<UserData>;

    updateProfile(employeeId : string, profile : UserProfile) : boolean;

}