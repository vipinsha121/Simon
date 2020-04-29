import { Component, Injectable, Directive, TemplateRef, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ReportServiceProxy } from '../../services/service-proxy/service-proxies';
import { LocalstorageService } from '../../services/local-storage/localstorage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'history-common-component',
  templateUrl: './history.component.html'

})

export class HistoryCommonComponent {
    @Input() title;
    @Input() sumresult;
    summaryHistoryList: any;
    currentDealData: any;
    dealId: any;

    constructor(public confirmService: confirmModalPopupService,
        private reportService: ReportServiceProxy,
        private localStorageService: LocalstorageService,
        private router: Router,
        public activeModal: NgbActiveModal)  {}

    ngOnInit() {
            this.summaryHistoryList = this.sumresult;  
         }


}