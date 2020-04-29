import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { LoanAdminComponent } from '../loanadmin/loanadmin.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
@Component({
    selector: 'toolbar-quickview',
    templateUrl: './quickview.component.html',
    styleUrls: ['./quickview.component.css']
})

export class QuickviewComponent implements OnInit {

    @Output() onIconClick: EventEmitter<any> = new EventEmitter();
    @Input() loanAdmin: LoanAdminComponent;
    constructor(public confirmService: confirmModalPopupService) { }
    ngOnInit() { }
    modalRef: NgbModalRef;


    open() {
        this.modalRef = this.confirmService.openQuickViewModal('Quick View');
    }
}
