import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserProfileLookup, UserProfileData, UserProfilesList } from 'src/app/@core/data/userclasses/userprofile';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'address', 'streetName', 'streetNo',
  'phoneNumber', 'emailAddress', 'cnp', 'countryName', 'countyName',
  'cityName', 'genderName', 'deleted'];
  dataSource = new MatTableDataSource<UserProfileLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userProfileData: UserProfileData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getUserProfiles();
  }

  getUserProfiles() {
      this.userProfileData.getUserProfiles().subscribe((userProfilesList: UserProfilesList) => {
          this.isLoading = false;
          this.dataSource.data = userProfilesList.userProfiles;
      }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
