import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DealDto, DealServiceProxy, CodeServiceProxy, ReportServiceProxy, ConfigServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { QueryBindingType } from '@angular/compiler/src/core';
import { filterQueryId } from '@angular/core/src/view/util';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
@Component({
    selector: 'report-Approval',
    templateUrl: './report-approvals.component.html'

})

export class ReportApprovalComponent implements OnInit {
    reportUrl = '';
    @Input() title;
    @Input() queryName;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    currentDealData: Deal;

    constructor(public activeModal: NgbActiveModal, private reportService: ConfigServiceProxy,
        private store: Store<AppState>
    ) {
        store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
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

        this.showReportById(this.queryName);
    }

    showReportById(queryName) {
        var qId = queryName;
        var url = "";
        switch (qId) {
            case "QRApprovalsByDeal": {
                return this.reportService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                    url = result.value_10;
                    this.reportUrl = url + '?reportName=' + 'rptApproval.rdl' + '&dealid_05=' + 15461;
                });
                break;
            }
            case "QRExceptionsByDeal":
                {
                    return this.reportService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        url = result.value_10;
                        this.reportUrl = url + '?reportName=' + 'rptFairLending.rdl' + '&dealid_05=' + 15461;
                    });
                    break;
                }
            case "QRMissingItemsByDeal":
                {
                    return this.reportService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        url = result.value_10;
                        this.reportUrl = url + '?reportName=' + 'rptMissingItem.rdl' + '&dealid_05=' + 15461;
                    });
                    break;
                }
            case "QRRequirementCommentsByDeal":
                {
                    return this.reportService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        url = result.value_10;
                        this.reportUrl = url + '?reportName=' + 'rptRequirementComment.rdl' + '&dealid_05=' + 15461 + '&Search=' + 0;
                    });
                    break;
                }
            case "QRMessage":
                {
                    return this.reportService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        url = result.value_10;
                        this.reportUrl = url + '?reportName=' + 'rptMessages.rdl' + '&dealid_05=' + 15461;
                    });
                    break;
                }
        }
    }
}

