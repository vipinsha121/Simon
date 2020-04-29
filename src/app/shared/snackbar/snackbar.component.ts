import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  class: string;
  icon: string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              public snackBarRef: MatSnackBarRef<SnackbarComponent>) { }

  ngOnInit() {
    if (this.data.indexOf('Save') > -1) {
      this.icon = 'check';
    } else if (this.data.indexOf('Cancel') > -1) {
      this.icon = 'not_interested';
    } else {
      this.icon = 'info';
    }
  }

}
