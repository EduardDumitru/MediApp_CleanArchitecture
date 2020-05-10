import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrescriptionXDrugData, PrescriptionXDrugsList,
    AddPrescriptionXDrugCommand, UpdatePrescriptionXDrugCommand } from '../data/prescriptionxdrug';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';

@Injectable()
export class PrescriptionXDrugService extends PrescriptionXDrugData {
    baseUrl = environment.baseURL + 'prescriptionxdrug';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }


    GetPrescriptionXDrugs(): Observable<PrescriptionXDrugsList> {
        return this.http.get<PrescriptionXDrugsList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addPrescriptionXDrugCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    DeletePrescriptionXDrug(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updatePrescriptionXDrugCommand), this.httpOptions)
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
