import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ReportServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'toolbar-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})

export class ToolbarHistoryComponent implements OnInit {
   dealId: any;
   summaryHistoryList: any;
    constructor(public confirmService: confirmModalPopupService,private router:Router,private reportService:ReportServiceProxy) { }
    ngOnInit() {

        let url = this.router.url.split('/')
        this.dealId = url[url.length-1];
        this.reportService.showReport('QRDealHistoryPSF', this.dealId).subscribe(result => {
            this.summaryHistoryList = result;
          });

    }
    modalRef: NgbModalRef;


    openHistoryModal() {

        this.modalRef = this.confirmService.openHistoryModal('History',this.summaryHistoryList);
    }
}
