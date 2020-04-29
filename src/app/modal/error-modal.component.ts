import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
    selector: 'error-modal-component',
    templateUrl: './error-modal.component.html'
})

export class ErrorModalComponent implements OnInit {

    @Input() modaltitle;
    @Input() message;
    @Output() onCloseClick: EventEmitter<any> = new EventEmitter();
    ngOnInit() { }
    constructor(public activeModal: NgbActiveModal) {
    }

    onClose() {
        this.onCloseClick.emit();
    }
}
