import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DrugsList, DrugData, DrugLookup } from 'src/app/@core/data/drug';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrls: ['./drugs.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class DrugsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<DrugLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly drugData = inject(DrugData);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getDrugs();
  }

  getDrugs(): void {
    this.isLoading = true;
    this.drugData.GetDrugs()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((drugsList: DrugsList) => {
        this.dataSource.data = drugsList.drugs;
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

  navigateToAddDrug(): void {
    this.router.navigate(['/diagnoses/drugs/add']);
  }
}