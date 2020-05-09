import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class HolidayIntervalDetails {
    employeeName: string;
    startDate: Date;
    endDate: Date;
    deleted?: boolean;
}

export class HolidayIntervalLookup {
    id: number;
    employeeName: string;
    startDate: Date;
    endDate: Date;
    deleted?: boolean;
}

export class HolidayIntervalsList {
    holidayIntervals: HolidayIntervalLookup[];
}

export class AddHolidayIntervalCommand {
    employeeId: number;
    startDate: Date;
    endDate: Date;
}

export class UpdateHolidayIntervalCommand {
    id: number;
    employeeId: number;
    startDate: Date;
    endDate: Date;
}

export class RestoreHolidayIntervalCommand {
    id: number;
}

export abstract class HolidayIntervalData {
    abstract GetHolidayIntervalDetails(id: number): Observable<HolidayIntervalDetails>;
    abstract GetHolidayIntervals(): Observable<HolidayIntervalsList>;
    abstract AddHolidayInterval(addHolidayIntervalCommand: AddHolidayIntervalCommand): Observable<Result>;
    abstract UpdateHolidayInterval(updateHolidayIntervalCommand: UpdateHolidayIntervalCommand): Observable<Result>;
    abstract DeleteHolidayInterval(id: number): Observable<Result>;
    abstract RestoreHolidayInterval(restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand): Observable<Result>;
}
