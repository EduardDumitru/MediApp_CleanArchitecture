import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { ErrorService } from 'src/app/shared/error.service';
import { RoleData } from '../data/role';
import { SelectItemsList } from '../data/common/selectitem';

@Injectable()
export class RoleService extends RoleData {
    baseUrl = environment.baseURL + 'Role';
    constructor(private http: HttpClient, private authService: AuthService, private errService: ErrorService) {
        super();
    }
    GetRolesDropdown(): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<SelectItemsList>(this.baseUrl + '/rolesdropdown', httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }

}
