import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GenderLookup, GenderData, GendersList } from 'src/app/@core/data/gender';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { CountriesList } from 'src/app/@core/data/country';

@Component({
  selector: 'app-genders',
  templateUrl: './genders.component.html',
  styleUrls: ['./genders.component.scss']
})
export class GendersComponent implements OnInit, AfterViewInit {

  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<GenderLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private genderData: GenderData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getGenders();
  }

  getGenders() {
      this.genderData.GetGenders().subscribe((gendersList: GendersList) => {
          this.isLoading = false;
          this.dataSource.data = gendersList.genders;
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
