import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'loan-admin',
    templateUrl: './loanadmin.component.html',
    styleUrls: ['./loanadmin.component.css']
})

export class LoanAdminComponent implements OnInit {

    @Input() participant: any = {}
    constructor(public activeModal: NgbActiveModal, ) {
    }

    ngOnInit() { }


}
