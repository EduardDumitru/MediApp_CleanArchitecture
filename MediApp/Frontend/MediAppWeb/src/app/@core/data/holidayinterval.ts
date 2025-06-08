import { Observable } from 'rxjs';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface HolidayIntervalDetails {
    employeeId: number;
    userProfileId?: number;
    startDate: Date;
    endDate: Date;
    deleted?: boolean;
}

export interface HolidayIntervalLookup {
    id: number;
    clinicName: string;
    employeeName: string;
    startDate: Date;
    endDate: Date;
    deleted?: boolean;
}

export class HolidayIntervalsList {
    holidayIntervals: HolidayIntervalLookup[] = [];
}

export interface AddHolidayIntervalCommand {
    employeeId: number;
    startDate: Date;
    endDate: Date;
}

export interface UpdateHolidayIntervalCommand {
    id: number;
    employeeId: number;
    startDate: Date;
    endDate: Date;
}

export interface RestoreHolidayIntervalCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class HolidayIntervalData {
    abstract GetHolidayIntervalDetails(id: number): Observable<HolidayIntervalDetails>;
    abstract GetHolidayIntervals(): Observable<HolidayIntervalsList>;
    abstract GetHolidayIntervalsByClinic(clinicId: number): Observable<HolidayIntervalsList>;
    abstract AddHolidayInterval(addHolidayIntervalCommand: AddHolidayIntervalCommand): Observable<Result | null>;
    abstract UpdateHolidayInterval(updateHolidayIntervalCommand: UpdateHolidayIntervalCommand): Observable<Result | null>;
    abstract DeleteHolidayInterval(id: number): Observable<Result | null>;
    abstract RestoreHolidayInterval(restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand): Observable<Result | null>;
}
