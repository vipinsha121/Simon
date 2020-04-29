import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DealDto, DealServiceProxy, CodeServiceProxy, ReportServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Alert } from 'selenium-webdriver';

@Component({
    selector: 'quickview-modal',
    templateUrl: './quickview-modal.component.html'

})
export class QuickViewModalComponent implements OnInit {
    reportLoanData: Array<any> = [];
    reportdealData: Array<any> = [];
    reportpartyData: Array<any> = [];
    reportcollateralData: Array<any> = [];
    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    currentDealData: Deal;

    @ViewChild('windowReference') window: jqxWindowComponent;
    @ViewChild('jqxWidget') jqxWidget: ElementRef;


    constructor(public activeModal: NgbActiveModal,
        private reportService: ReportServiceProxy,
        private store: Store<AppState>
    ) {

        store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            if (this.currentDealData) {
            }
        });
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

        this.getReportLoanData();
        this.getReportDealData();
        this.getReportPartyData();
        this.getReportCollateralData();
    }


    getReportLoanData() {
        return this.reportService.showReport('QRLoansByDeal', parseInt(this.currentDealData.dealId)).subscribe(result => {
            this.reportLoanData = result;
        });
    }

    getReportDealData() {
        return this.reportService.showReport('QRDealSummary', parseInt(this.currentDealData.dealId)).subscribe(result => {
            this.reportdealData = result;
        });
    }

    getReportPartyData() {
        return this.reportService.showReport('QRPartysByDeal', parseInt(this.currentDealData.dealId)).subscribe(result => {
            this.reportpartyData = result;
        });
    }

    getReportCollateralData() {
        return this.reportService.showReport('QRCollateralsByDeal', parseInt(this.currentDealData.dealId)).subscribe(result => {
            this.reportcollateralData = result;
        });
    }

    /* #region jqxWindow (pop up) for Quick View */

    ngAfterViewInit(): void {
        let offsetLeft = this.jqxWidget.nativeElement.offsetLeft;
        let offsetTop = this.jqxWidget.nativeElement.offsetTop;
        this.window.position({ x: offsetLeft + 50, y: offsetTop + 50 });
        this.window.focus();
    }

    // Resize Check Box
    onResizeCheckBox(event: any): void {
        if (event.args.checked) {
            this.window.resizable(true);
        }
        else {
            this.window.resizable(false);
        }
    };

    // Drag Check Box
    onDragCheckBox(event: any): void {
        if (event.args.checked) {
            this.window.draggable(true);
        }
        else {
            this.window.draggable(false);
        }
    };

    // Open window
    onShowButton() {
        this.window.open();
    };

    // Hide window
    onHideButton(): void {
        this.window.close();
    };

    /* #endregion jqxWindow End */

}