import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MedicalCheckTypeData, MedicalCheckTypeDetails,
    MedicalCheckTypesList, AddMedicalCheckTypeCommand,
     UpdateMedicalCheckTypeCommand, RestoreMedicalCheckTypeCommand } from '../data/medicalchecktype';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class MedicalCheckTypeService extends MedicalCheckTypeData {
    baseUrl = environment.baseURL + 'MdicalCheckType';

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


    GetMedicalCheckTypeDetails(id: number): Observable<MedicalCheckTypeDetails> {
        return this.http.get<MedicalCheckTypeDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetMedicalCheckTypes(): Observable<MedicalCheckTypesList> {
        return this.http.get<MedicalCheckTypesList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetMedicalCheckTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/medicalchecktypesdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddMedicalCheckType(addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addMedicalCheckTypeCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateMedicalCheckType(updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateMedicalCheckTypeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteMedicalCheckType(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreMedicalCheckType(restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreMedicalCheckTypeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
