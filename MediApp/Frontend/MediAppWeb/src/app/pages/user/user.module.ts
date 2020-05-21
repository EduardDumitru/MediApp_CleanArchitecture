import { NgModule } from '@angular/core';

import { UserProfileComponent } from './userprofile/userprofile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { USERROUTES } from './user-routing';


@NgModule({
    imports: [USERROUTES, SharedModule],
    exports: [],
    declarations: [UserProfileComponent],
    providers: [],
})
export class UserModule { }
