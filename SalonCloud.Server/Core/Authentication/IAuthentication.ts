export interface IAuthentication {
    SignUp(username: string, password: string);
    SignIn(username: string, password: string);
}