import { NgModule } from '@angular/core';

import { UserProfileComponent } from './userprofile/userprofile.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    imports: [SharedModule],
    exports: [],
    declarations: [UserProfileComponent],
    providers: [],
})
export class UserModule { }
