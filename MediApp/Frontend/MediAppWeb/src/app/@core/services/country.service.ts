import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CountryData, CountryDetails, CountriesList,
    AddCountryCommand, UpdateCountryCommand, RestoreCountryCommand } from '../data/country';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class CountryService extends CountryData {


    baseUrl = environment.baseURL + 'Country';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetCountryDetails(id: number): Observable<CountryDetails> {
        return this.http.get<CountryDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCountries(): Observable<CountriesList> {
        return this.http.get<CountriesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCountriesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/countriesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddCountry(addCountryCommand: AddCountryCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addCountryCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateCountry(updateCountryCommand: UpdateCountryCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateCountryCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteCountry(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreCountry(restoreCountryCommand: RestoreCountryCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreCountryCommand), this.httpOptions)
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
