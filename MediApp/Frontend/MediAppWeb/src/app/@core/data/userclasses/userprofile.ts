import { Observable } from 'rxjs';
import { Result } from '../common/result';

export class UserProfileDetail {
    firstName: string;
    middleName: string;
    lastName: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    emailAddress: string;
    cnp: string;
    countryId: number;
    countyId: number;
    cityId: number;
    genderId: number;
    deleted?: boolean;
}

export class UserProfileLookup {
    id: number;
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    emailAddress: string;
    cnp: string;
    countryName: string;
    countyName: string;
    cityName: string;
    genderName: string;
    deleted?: boolean;
}

export class UserProfilesList {
    userProfiles: UserProfileLookup[];
}

export class UpdateUserProfileCommand {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    emailAddress: string;
    cnp: string;
    countryId: number;
    countyId: number;
    cityId: number;
    genderId: number;
    deleted?: boolean
}

export abstract class UserProfileData {
    abstract getUserProfiles(): Observable<UserProfilesList>;
    abstract getUserProfile(id: number): Observable<UserProfileDetail>;
    abstract updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result>;
}
