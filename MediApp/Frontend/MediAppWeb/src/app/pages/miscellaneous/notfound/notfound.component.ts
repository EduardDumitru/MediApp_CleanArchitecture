import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-notfound',
  styleUrls: ['./notfound.component.scss'],
  templateUrl: './notfound.component.html',
})
export class NotFoundComponent {

  constructor(private _location: Location) {
  }

  goBack() {
    this._location.back();
  }
}
