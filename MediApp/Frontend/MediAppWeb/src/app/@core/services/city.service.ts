import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CityData, CityDetails, CitiesList, AddCityCommand, UpdateCityCommand, RestoreCityCommand } from '../data/city';
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

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`
        })
    };

    constructor(private http: HttpClient, private errService: ErrorService, private authService: AuthService) {
        super();
    }

    GetCityDetails(id: number): Observable<CityDetails> {
        return this.http.get<CityDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCities(): Observable<CitiesList> {
        console.log('ajungec');
        return this.http.get<CitiesList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCitiesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown')
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown/' + countyId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddCity(addCityCommand: AddCityCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addCityCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateCityCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteCity(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreCityCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
