import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';


@Component({
  selector: 'confirm-modal-component',
  templateUrl: './confirm-model.component.html'

})
export class ConfirmModalComponent implements OnInit {


  @Input() reportLoanData: any;
  @Input() title;
  @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
  @Output() onNoConfirmClick: EventEmitter<any> = new EventEmitter();


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
    this.onConfirmClick.emit();
  }
  onNoClick() {
    this.onNoConfirmClick.emit();
  }


}
