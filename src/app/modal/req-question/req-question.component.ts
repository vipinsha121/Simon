import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
    selector: 'req-question',
    templateUrl: './req-question.component.html'

})

export class ReqQuestionModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) {

    }

    @Input() requirement: any;
    @Input() openReqQuestionModal: any;
    @Output() isExceptionClick: EventEmitter<any> = new EventEmitter();
    @Output() onCancelClick: EventEmitter<any> = new EventEmitter();


    ngOnInit() { }


    onApplyClick(reqEditCopy) {
        //this.activeModal.dismiss();
        this.isExceptionClick.emit(reqEditCopy);
    }

    NoCancel(requirement) {
        this.onCancelClick.emit(requirement);
    }
}