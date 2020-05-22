import { NgModule } from '@angular/core';

import { UserProfileComponent } from './userprofile/userprofile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { USERROUTES } from './user-routing';
import { GenderComponent } from './gender/gender/gender.component';
import { GendersComponent } from './gender/genders/genders.component';


@NgModule({
    imports: [USERROUTES, SharedModule],
    exports: [],
    declarations: [UserProfileComponent, GenderComponent, GendersComponent],
    providers: [],
})
export class UserModule { }
