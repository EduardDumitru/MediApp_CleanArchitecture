import { Observable } from 'rxjs/internal/Observable';
import { AuthSuccessResponse } from '../common/authresponse';
import { CurrentUser } from './currentuser';

export class AddUserCommand {
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address: string;
    streetName: string;
    streetNo: string;
    cnp: string;
    phoneNumber: string;
    countryId: number;
    countyId: number;
    cityId: number;
    genderId: number;
}

export class LoginUserCommand {
    email: string;
    password: string;
}

export abstract class UserData {
    abstract AddUser(addUserCommand: AddUserCommand): Observable<AuthSuccessResponse>;
    abstract LoginUser(loginUserCommand: LoginUserCommand): Observable<AuthSuccessResponse>;
    abstract GetCurrentUser(): Observable<CurrentUser>;
}
