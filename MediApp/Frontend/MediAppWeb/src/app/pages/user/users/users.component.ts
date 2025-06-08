import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserProfileLookup, UserProfileData, UserProfilesList } from 'src/app/@core/data/userclasses/userprofile';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'address', 'streetName', 'streetNo',
    'phoneNumber', 'emailAddress', 'cnp', 'countryName', 'countyName',
    'cityName', 'genderName', 'deleted'];
  dataSource = new MatTableDataSource<UserProfileLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userProfileData = inject(UserProfileData);
  private uiService = inject(UIService);

  ngOnInit(): void {
    this.getUserProfiles();
  }

  getUserProfiles(): void {
    this.isLoading = true;
    this.userProfileData.getUserProfiles()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ userProfiles: [] } as UserProfilesList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((userProfilesList: UserProfilesList) => {
        this.dataSource.data = userProfilesList.userProfiles;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}