import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { ReportServiceProxy } from '../../../../../../shared/services/service-proxy/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-summary-detail',
  templateUrl: './summary-detail.component.html',
  styleUrls: ['./summary-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryDetailComponent implements OnInit {
  mediaQuery;
  mobileQuery;
  summaryDetailForm: FormGroup;
  dealId: any;
  summaryHistoryList: any;
  _mobileQueryListener: () => void;
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,  private reportService: ReportServiceProxy, private router: Router,) {

    this.mediaQuery = media.matchMedia('(min-width: 1900px');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mediaQuery.addListener(this._mobileQueryListener);

    this.mobileQuery = media.matchMedia('(max-width: 700px');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    let url = this.router.url.split('/')
    this.dealId = url[url.length-1];
    this.getHistory();

   }

  ngOnInit() {
    let purpose = new FormControl;
    let notes = new FormControl;
    let employee = new FormControl;

    this.summaryDetailForm = new FormGroup({
      purpose,
      notes,
      employee
    });



  }
  getHistory() {
    this.reportService.showReport('QRDealHistoryPSF', this.dealId).subscribe(result => {
      this.summaryHistoryList = result;
    });   
     
  }
  clearDirty() {
    this.summaryDetailForm.markAsPristine();
  }

}
