import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isLoading = new Subject<boolean>();
  // Show the spinner
  show() {
    this.isLoading.next(true);
  }
  // Hide the spinner
  hide() {
    this.isLoading.next(false);
  }

}
