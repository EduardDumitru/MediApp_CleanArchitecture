import { Observable } from 'rxjs/internal/Observable';
import { AuthSuccessResponse } from '../common/authresponse';
import { CurrentUser } from './currentuser';
import { Injectable } from '@angular/core';

export interface AddUserCommand {
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

export interface LoginUserCommand {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})

export abstract class UserData {
    abstract AddUser(addUserCommand: AddUserCommand): Observable<AuthSuccessResponse | null>;
    abstract LoginUser(loginUserCommand: LoginUserCommand): Observable<AuthSuccessResponse | null>;
    abstract GetCurrentUser(): Observable<CurrentUser>;
}
