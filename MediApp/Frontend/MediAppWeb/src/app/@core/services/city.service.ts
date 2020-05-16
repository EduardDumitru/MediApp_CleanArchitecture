import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CityData, CityDetails, CitiesList, AddCityCommand, UpdateCityCommand, RestoreCityCommand } from '../data/city';
import { Observable, throwError } from 'rxjs';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class CityService extends CityData {

    baseUrl = environment.baseURL + 'City';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };


    constructor(private http: HttpClient) {
        super();
    }

    GetCityDetails(id: number): Observable<CityDetails> {
        return this.http.get<CityDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCities(): Observable<CitiesList> {
        return this.http.get<CitiesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCitiesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/citiesdropdown/' + countyId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddCity(addCityCommand: AddCityCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addCityCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateCityCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteCity(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreCityCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }

    errorHandl(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}
