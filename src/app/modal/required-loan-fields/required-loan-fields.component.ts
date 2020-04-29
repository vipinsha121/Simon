import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-required-loan-fields',
  templateUrl: './required-loan-fields.component.html',
  styleUrls: ['./required-loan-fields.component.css']
})
export class RequiredLoanFieldsComponent implements OnInit {

  @Input() requiredLoanFields: any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.requiredLoanFields = this.requiredLoanFields;
  }

}
