
import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ReportServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { ThrowStmt } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'history-modal',
    templateUrl: './history-modal.component.html',
    styleUrls: ['./history-modal.component.css']
})

export class HistoryModalComponent implements OnInit {
    @Input() title;
    @Input() summaryList;


    constructor(public confirmService: confirmModalPopupService,
        private localStorageService: LocalstorageService,
        public activeModal: NgbActiveModal)  {}

    ngOnInit() {}
}
