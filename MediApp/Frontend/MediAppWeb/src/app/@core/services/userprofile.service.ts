import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import {
    UserProfileData,
    UserProfileDetail,
    UpdateUserProfileCommand,
    UserProfilesList
} from '../data/userclasses/userprofile';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class UserProfileService extends UserProfileData {
    private readonly baseUrl = `${environment.baseURL}UserProfile`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get all user profiles
     * @returns Observable with list of user profiles
     */
    override getUserProfiles(): Observable<UserProfilesList> {
        return this.http.get<UserProfilesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<UserProfilesList>('getUserProfiles', error, {} as UserProfilesList))
        );
    }

    /**
     * Get details for a specific user profile
     * @param id User profile ID
     * @returns Observable with user profile details
     */
    override getUserProfile(id: number): Observable<UserProfileDetail> {
        return this.http.get<UserProfileDetail>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<UserProfileDetail>('getUserProfile', error, {} as UserProfileDetail))
        );
    }

    /**
     * Update an existing user profile
     * @param userProfile User profile data to update
     * @returns Observable with result
     */
    override updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result> {
        return this.http.put<Result>(
            this.baseUrl,
            userProfile, // No need for JSON.stringify - Angular's HttpClient handles this
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result>('updateUserProfile', error, {} as Result))
        );
    }

    /**
     * Get user profiles for dropdown selection
     * @returns Observable with list of select items
     */
    override getUserProfilesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/usersdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            retry(1),
            catchError(error => this.errorService.handleError<SelectItemsList>('getUserProfilesDropdown', error, { selectItems: [] }))
        );
    }
}