import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';


@Component({
    selector: 'manageparticipation-modal',
    templateUrl: './manageparticipation-modal.component.html'

})
export class ManageParticipationModalComponent implements OnInit {


    @Input() reportLoanData: Array<any> = [];
    @Input() title;

    constructor(public activeModal: NgbActiveModal) {
    }
    ngOnInit() {
    }



}