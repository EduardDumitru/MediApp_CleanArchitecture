import { Component, inject } from '@angular/core';
import { Location, NgIf } from '@angular/common';

import { getSharedImports } from '../shared/shared.module';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class NotFoundComponent {
  private readonly location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}