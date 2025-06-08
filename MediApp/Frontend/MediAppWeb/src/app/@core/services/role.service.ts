import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';
import { RoleData } from '../data/role';
import { SelectItemsList } from '../data/common/selectitem';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends RoleData {
    private readonly baseUrl = `${environment.baseURL}Role`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get roles for dropdown
     * @returns Observable with select items list
     */
    override GetRolesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/rolesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetRolesDropdown', error, new SelectItemsList()))
        );
    }
}