import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    MedicalCheckData,
    MedicalCheckDetails,
    AddMedicalCheckCommand,
    UpdateMedicalCheckCommand,
    EmployeeMedicalChecksList,
    PatientMedicalChecksList,
    MedicalChecksToAddQuery,
    MedicalChecksToAddList,
    MedicalChecksByClinicList
} from '../data/medicalcheck';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class MedicalCheckService extends MedicalCheckData {
    private readonly baseUrl = `${environment.baseURL}MedicalCheck`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific medical check
     * @param id Medical check ID
     * @returns Observable with medical check details
     */
    override GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails> {
        return this.http.get<MedicalCheckDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<MedicalCheckDetails>('GetMedicalCheckDetails', error, {} as MedicalCheckDetails))
        );
    }

    /**
     * Get medical checks for an employee
     * @param employeeId Employee ID
     * @returns Observable with list of employee medical checks
     */
    override GetEmployeeMedicalChecks(employeeId: number): Observable<EmployeeMedicalChecksList> {
        return this.http.get<EmployeeMedicalChecksList>(
            `${this.baseUrl}/employeemedicalchecks/${employeeId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeeMedicalChecksList>('GetEmployeeMedicalChecks', error, new EmployeeMedicalChecksList()))
        );
    }

    /**
     * Get medical checks for a patient
     * @param patientId Patient ID
     * @returns Observable with list of patient medical checks
     */
    override GetPatientMedicalChecks(patientId: number): Observable<PatientMedicalChecksList> {
        return this.http.get<PatientMedicalChecksList>(
            `${this.baseUrl}/patientmedicalchecks/${patientId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PatientMedicalChecksList>('GetPatientMedicalChecks', error, new PatientMedicalChecksList()))
        );
    }

    /**
     * Get medical checks for a clinic
     * @param clinicId Clinic ID
     * @returns Observable with list of medical checks by clinic
     */
    override GetMedicalChecksByClinic(clinicId: number): Observable<MedicalChecksByClinicList> {
        return this.http.get<MedicalChecksByClinicList>(
            `${this.baseUrl}/byclinic/${clinicId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<MedicalChecksByClinicList>('GetMedicalChecksByClinic', error, new MedicalChecksByClinicList()))
        );
    }

    /**
     * Get medical checks available to add
     * @param medicalChecksToAdd Query parameters
     * @returns Observable with list of medical checks to add
     */
    override GetMedicalChecksToAdd(medicalChecksToAdd: MedicalChecksToAddQuery): Observable<MedicalChecksToAddList> {
        return this.http.post<MedicalChecksToAddList>(
            `${this.baseUrl}/toadd`,
            medicalChecksToAdd,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<MedicalChecksToAddList>('GetMedicalChecksToAdd', error, new MedicalChecksToAddList()))
        );
    }

    /**
     * Add a new medical check
     * @param addMedicalCheckCommand Medical check data
     * @returns Observable with result
     */
    override AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addMedicalCheckCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddMedicalCheck', error, null))
        );
    }

    /**
     * Update an existing medical check
     * @param updateMedicalCheckCommand Medical check data
     * @returns Observable with result
     */
    override UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateMedicalCheckCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateMedicalCheck', error, null))
        );
    }

    /**
     * Delete a medical check
     * @param id Medical check ID
     * @returns Observable with result
     */
    override DeleteMedicalCheck(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteMedicalCheck', error, null))
        );
    }
}