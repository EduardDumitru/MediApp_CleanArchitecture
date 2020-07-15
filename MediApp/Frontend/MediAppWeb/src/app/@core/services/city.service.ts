import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CityData, CityDetails, CitiesList, AddCityCommand, UpdateCityCommand, RestoreCityCommand, CityFromEmployeesDropdownQuery } from '../data/city';
import { Observable, throwError } from 'rxjs';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { environment } from 'src/environments/environment';
import { retry, catchError, map } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class CityService extends CityData {

    baseUrl = environment.baseURL + 'City';

    constructor(private http: HttpClient, private errService: ErrorService, private authService: AuthService) {
        super();
    }

    GetCityDetails(id: number): Observable<CityDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<CityDetails>(this.baseUrl + '/' + id, httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCities(): Observable<CitiesList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<CitiesList>(this.baseUrl, httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCitiesDropdown(): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json'
            })
        };
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown', httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json'
            })
        };
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown/' + countyId, httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCitiesByCountyFromEmployeesDropdown(cityDropdownQuery: CityFromEmployeesDropdownQuery): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.post<SelectItemsList>(this.baseUrl + '/citiesdropdownfromemployees/' , JSON.stringify(cityDropdownQuery),
        httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddCity(addCityCommand: AddCityCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addCityCommand), httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateCityCommand), httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteCity(id: number): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.delete<Result>(this.baseUrl + '/' + id, httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreCityCommand), httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
