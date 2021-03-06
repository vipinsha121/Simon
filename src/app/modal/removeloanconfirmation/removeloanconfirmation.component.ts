import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';


@Component({
    selector: 'removeloanconfirmation-modal-component',
    templateUrl: './removeloanconfirmation.component.html'

})
export class RemoveLoanConfirmModalComponent implements OnInit {


    @Input() loanMessage: any;
    @Input() title;
    @Input() isCollAssociated: boolean;
    @Output() onremoveConfirmClick: EventEmitter<any> = new EventEmitter();
    @Output() onNoremoveConfirmClick: EventEmitter<any> = new EventEmitter();
    @Output() closeModalPopup: EventEmitter<any> = new EventEmitter();


    constructor(public activeModal: NgbActiveModal) {

    }
    ngOnInit() {
        $(document).ready(function () {
            let modalContent: any = $('.modal-content');
            let modalHeader = $('.modal-header');
            modalHeader.addClass('cursor-all-scroll');
            modalContent.draggable({
                handle: '.modal-header'
            });
        });
    }
    onYesClick() {
        this.onremoveConfirmClick.emit();
    }
    onNoClick() {
        this.onNoremoveConfirmClick.emit();
    }

    closeModal() {
        this.closeModalPopup.emit();
    }


}
