import { of, Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
    UserData,
    AddUserCommand,
    LoginUserCommand
} from '../data/userclasses/user';
import { CurrentUser } from '../data/userclasses/currentuser';
import { AuthSuccessResponse } from '../data/common/authresponse';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class UserService extends UserData {
    private readonly baseUrl = `${environment.baseURL}User`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Add a new user
     * @param addUserCommand User data
     * @returns Observable with auth success response
     */
    override AddUser(addUserCommand: AddUserCommand): Observable<AuthSuccessResponse> {
        return this.http.post<AuthSuccessResponse>(
            `${this.baseUrl}/adduser`,
            addUserCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<AuthSuccessResponse>('AddUser', error, {} as AuthSuccessResponse))
        );
    }

    /**
     * Login user
     * @param loginUserCommand Login credentials
     * @returns Observable with auth success response
     */
    override LoginUser(loginUserCommand: LoginUserCommand): Observable<AuthSuccessResponse> {
        return this.http.post<AuthSuccessResponse>(
            `${this.baseUrl}/login`,
            loginUserCommand,
            this.apiHelper.getOptions() // No auth needed for login
        ).pipe(
            catchError(error => this.errorService.handleError<AuthSuccessResponse>('LoginUser', error, {} as AuthSuccessResponse))
        );
    }

    /**
     * Get current user details from token
     * @returns Observable with current user
     */
    override GetCurrentUser(): Observable<CurrentUser> {
        const token = this.authService.getDecodedToken();
        if (token === null) {
            // If no token is found, return an empty user object
            return of({
                email: '',
                firstName: '',
                lastName: '',
                id: 0
            } as CurrentUser);
        }
        const user: CurrentUser = {
            email: token?.['email'] as string,
            firstName: token?.['firstName'] as string,
            lastName: token?.['lastName'] as string,
            id: Number(token?.id)
        };
        return of(user);
    }
}