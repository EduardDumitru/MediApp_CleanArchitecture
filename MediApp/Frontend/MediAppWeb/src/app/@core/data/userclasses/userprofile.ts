import { Observable } from 'rxjs';
import { Result } from '../common/result';
import { SelectItemsList } from '../common/selectitem';
import { Injectable } from '@angular/core';

export interface UserProfileDetail {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    address?: string | null;
    streetName?: string | null;
    streetNo: string;
    phoneNumber: string;
    emailAddress: string;
    cnp: string;
    countryId: number;
    countyId: number;
    cityId: number;
    genderId: number;
    roleIds: string[];
    deleted?: boolean;
}

export interface UserProfileLookup {
    id: number;
    name: string;
    address?: string | null;
    streetName?: string | null;
    streetNo?: string | null;
    phoneNumber?: string | null;
    emailAddress: string;
    cnp: string;
    countryName: string;
    countyName: string;
    cityName: string;
    genderName: string;
    deleted?: boolean;
}

export interface UserProfilesList {
    userProfiles: UserProfileLookup[];
}

export interface UpdateUserProfileCommand {
    id: number;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    address?: string | null;
    streetName?: string | null;
    streetNo: string;
    phoneNumber: string;
    cnp: string;
    countryId: number;
    countyId: number;
    cityId: number;
    genderId: number;
    roleIds: number[];
}

@Injectable({
    providedIn: 'root'
})

export abstract class UserProfileData {
    abstract getUserProfiles(): Observable<UserProfilesList>;
    abstract getUserProfile(id: number): Observable<UserProfileDetail>;
    abstract getUserProfilesDropdown(): Observable<SelectItemsList>;
    abstract updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result>;
}