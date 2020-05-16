import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountyData, CountyDetails, CountiesList, AddCountyCommand, UpdateCountyCommand, RestoreCountyCommand } from '../data/county';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class CountyService extends CountyData {
    baseUrl = environment.baseURL + 'County';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetCountyDetails(id: number): Observable<CountyDetails> {
        return this.http.get<CountyDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCounties(): Observable<CountiesList> {
        return this.http.get<CountiesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCountiesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/countiesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetCountiesByCountryDropdown(countryId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/countiesdropdown/' + countryId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddCounty(addCountyCommand: AddCountyCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addCountyCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateCounty(updateCountyCommand: UpdateCountyCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateCountyCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteCounty(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreCounty(restoreCountyCommand: RestoreCountyCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreCountyCommand), this.httpOptions)
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
