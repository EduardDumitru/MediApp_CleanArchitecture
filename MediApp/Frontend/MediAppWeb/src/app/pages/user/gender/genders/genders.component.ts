import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { GenderLookup, GenderData, GendersList } from 'src/app/@core/data/gender';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-genders',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './genders.component.html',
  styleUrls: ['./genders.component.scss']
})
export class GendersComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<GenderLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Use modern dependency injection
  private genderData = inject(GenderData);
  private uiService = inject(UIService);

  ngOnInit(): void {
    this.getGenders();
  }

  getGenders(): void {
    this.isLoading = true;
    this.genderData.GetGenders()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ genders: [] } as GendersList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((gendersList: GendersList) => {
        this.dataSource.data = gendersList.genders;
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