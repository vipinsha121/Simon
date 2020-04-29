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
import { type } from 'os';
@Component({
    selector: 'report-Approval',
    templateUrl: './report-approval-modal.component.html',
    styleUrls: ['./report-approval-modal.component.css']
})

export class ReportApprovalModalComponent implements OnInit {
    showShearchTextBox = false;
    reportUrl = '';
    url = "";
    searchString = '';
    filterString = '';
    @Input() title;
    @Input() queryName;
    @Input() dealId;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    currentDealData: Deal;
    searchRequirement: any;

    constructor(public activeModal: NgbActiveModal, private configService: ConfigServiceProxy,
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
        if (this.queryName == "QRRequirementCommentsByDeal") {
            this.showShearchTextBox = true;
        }
    }

    showReportById(queryName) {
        var qId = queryName;
        this.searchString = this.searchRequirement;
        var filterString = '';
        switch (qId) {
            case "QRApprovalsByDeal": {
                return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                    this.url = result.value_10;
                    this.reportUrl = this.url + '?reportName=' + 'rptApproval.rdl' + '&dealid_05=' + this.dealId;
                });
                break;
            }
            case "QRExceptionsByDeal":
                {
                    return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        this.url = result.value_10;
                        this.reportUrl = this.url + '?reportName=' + 'rptFairLending.rdl' + '&dealid_05=' + this.dealId;
                    });
                    break;
                }
            case "QRMissingItemsByDeal":
                {
                    return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        this.url = result.value_10;
                        this.reportUrl = this.url + '?reportName=' + 'rptMissingItem.rdl' + '&dealid_05=' + this.dealId;
                    });
                    break;
                }
            case "QRRequirementCommentsByDeal":
                {
                    return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        this.url = result.value_10;
                        this.reportUrl = this.url + '?reportName=' + 'rptRequirementComment.rdl' + '&dealid_05=' + this.dealId + '&Search=' + this.filterString;
                    });
                    break;
                }
            case "QRMessage":
                {
                    return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
                        this.url = result.value_10;
                        this.reportUrl = this.url + '?reportName=' + 'rptMessages.rdl' + '&dealid_05=' + this.dealId;
                        console.log(this.reportUrl);
                    });
                    break;
                }
            default: {
                break;
            }
        }
    }

    filterReport(event: any) {
        this.searchString = event.target.value;
        if (this.searchString != null || this.searchString != undefined) {
            this.filterString = this.searchString;
        }
        return this.configService.getConfigValue('SSRSReportViewerSimon2Url').subscribe(result => {
            this.url = result.value_10;
            this.reportUrl = this.url + '?reportName=' + 'rptRequirementComment.rdl' + '&dealid_05=' + this.dealId + '&Search=' + this.filterString;
        });
    }
}
