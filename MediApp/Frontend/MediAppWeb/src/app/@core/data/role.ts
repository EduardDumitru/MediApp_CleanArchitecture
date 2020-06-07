import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';

export abstract class RoleData {
    abstract GetRolesDropdown(): Observable<SelectItemsList>;
}