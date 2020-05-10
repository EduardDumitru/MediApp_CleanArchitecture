import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MedicalCheckTypeData, MedicalCheckTypeDetails,
    MedicalCheckTypesList, AddMedicalCheckTypeCommand,
     UpdateMedicalCheckTypeCommand, RestoreMedicalCheckTypeCommand } from '../data/medicalchecktype';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class MedicalCheckTypeService extends MedicalCheckTypeData {
    baseUrl = environment.baseURL + 'medicalchecktype';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetMedicalCheckTypeDetails(id: number): Observable<MedicalCheckTypeDetails> {
        return this.http.get<MedicalCheckTypeDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetMedicalCheckTypes(): Observable<MedicalCheckTypesList> {
        return this.http.get<MedicalCheckTypesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetMedicalCheckTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/medicalchecktypesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddMedicalCheckType(addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addMedicalCheckTypeCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateMedicalCheckType(updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateMedicalCheckTypeCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteMedicalCheckType(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreMedicalCheckType(restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreMedicalCheckTypeCommand), this.httpOptions)
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
