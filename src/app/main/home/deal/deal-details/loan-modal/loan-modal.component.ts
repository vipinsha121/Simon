import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DealDto, DealServiceProxy, LoanServiceProxy, CodeServiceProxy, RequirementServiceProxy, LoanDetailsDto } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DealHeaderService } from '../../deal-header/deal-header.service';
import { Subscription } from 'rxjs';
import { EventEmitterService } from '../party-modal/party-form/party-form-service/event-emitter.service';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './loan-modal.component.html',
  styleUrls: ['./loan-modal.component.scss'],

})
export class LoanModalComponent implements OnInit {
  fullWidth: boolean = true;
  subscription: Subscription;
  mobileQuery;
  @Input() currentDeal: any;
  loanData: any;
  loancount: number;
  loanDetails: LoanDetailsDto = new LoanDetailsDto();
  loanCollateralCount;
  _mobileQueryListener: () => void;
  dealcount: number;
  dealId: number = 0;
  loanId: number = 0;
  openFullRequests: any[] = [];
  reqType: Array<any> = [];
  exstingLoanType: Array<any> = [];
  isNewLoan: boolean;
  newreqid: any;
  diffRequirements;
  totalRequirements;
  requirements: Array<any> = []; req: string;
  completeRequirements; loanRequirementOpenCnt: any; loLinksCal: any; loLinksConst: any; loLinksMisc: any;
  //partyRequirementOpen: any;
  modalRef: NgbModalRef;

  constructor(private loanService: LoanServiceProxy,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private dealHeaderservice: DealHeaderService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private codeService: CodeServiceProxy,
    private requirementService: RequirementServiceProxy,
    public confirmService: confirmModalPopupService) {

    this.mobileQuery = media.matchMedia('(max-width: 1275px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    activatedRoute.parent.params.subscribe(params => {
      this.dealId = params["dealId"];
      this.loanService.getLoansForDeal(this.dealId).subscribe(res => {
        this.loanData = res;
        this.loancount = this.loanData.length;
        if (this.loancount > 0) {
          this.loanData.forEach(loan => {
            this.loanService.getRequirementsForLoan(this.dealId, loan.id).subscribe((res) => {
              this.requirements = res;
              this.totalRequirements = res.length;
              this.completeRequirements = this.requirements.filter(req => {
                return req.complete === true;
              }).length;
              this.diffRequirements = (this.completeRequirements / this.totalRequirements) * 100;
              loan.requirements = this.diffRequirements;
              if (this.diffRequirements >= 90) {
                loan.cssClass = 'progress-green mat-line mat-progress-bar mat-primary';
              } else if (this.diffRequirements < 90 && this.diffRequirements >= 25) {
                loan.cssClass = 'progress-orange mat-line mat-progress-bar mat-primary';
              } else {
                loan.cssClass = 'progress-red mat-line mat-progress-bar mat-primary';
              }
            });
            if (this.dealId && this.loanId) {
              this.loanService.getLoanDetails(this.dealId, this.loanId).subscribe(res => {
                this.loanDetails = res;
                if (this.loanDetails) { this.loanCollateralCount = res.collateralCount; }

              });
            }
          });
        }
      });

    });

    this.subscription = this.eventEmitterService.getloanlist().subscribe(data => {
      if (data) {
        this.loanData = null;
        this.loanData = data;
        this.loancount = this.loanData.length;
        this.fullWidth = true;
      }
    });

    this.cloudIconDropdown();


    if (activatedRoute.firstChild) {
      activatedRoute.firstChild.params.subscribe(params => {
        this.loanId = params["loanId"];
      });
    }


    this.subscription = this.dealHeaderservice.getFullLoan().subscribe(openFullRequest => {
      if (openFullRequest) {
        this.openFullRequests.push(openFullRequest);
        this.fullWidth = true;
      } else {
        this.openFullRequests = [];
      }
    });
  }


  ngOnInit() {

    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.activatedRoute.parent.params.subscribe(params => {
            this.dealId = params["dealId"];
            this.loanService.getLoansForDeal(this.dealId).subscribe(res => {
              this.loanData = res;
              this.loancount = this.loanData.length;
            });
          });
        });
    }
    if (this.eventEmitterService.rmloan == undefined) {
      this.eventEmitterService.rmloan = this.eventEmitterService.
        invokeRemoveLoanFunction.subscribe((name: string) => {
          this.activatedRoute.parent.params.subscribe(params => {
            this.dealId = params["dealId"];
            this.loanService.getLoansForDeal(this.dealId).subscribe(res => {
              this.loanData = null;
              this.loanData = res;
              this.loancount = this.loanData.length;
              this.fullWidth = false;
              this.fullWidth = true;

            });
          });
        });

    }

    if (this.loanId > 0) { this.fullWidth = false; }

    //To bind RequestType Dropdown.
    this.codeService.getDropdownData("LnRequestTypeFormDropDown").subscribe(result => {
      this.reqType = result;
    });

    //To get Existing Loan.
    this.bindExistingLoan();

    //To Emit Existing Loan
    if (this.eventEmitterService.nonExistingLoan == undefined) {
      this.eventEmitterService.nonExistingLoan = this.eventEmitterService.
        invokeNonExistingLoan.subscribe((name: string) => {

          // this.loanService.getAvailableLoans(this.dealId).subscribe(data => {
          //   this.exstingLoanType = data;
          // });
          this.bindExistingLoan();
        });
    }

    //TO bind Requirements for loan.
    this.requirementService.getRequirementList(this.dealId).subscribe(data => {
      this.loanRequirementOpenCnt = data.loanRequirementOpen;
    })

    // this.requirementService.getRequirementList(this.dealId).subscribe(data => {
    //   this.partyRequirementOpen = data.partyRequirementOpen;
    // })
  }

  //To open and close loan form.
  formToggle() {
    this.fullWidth = !this.fullWidth;

  }

  sendHalf(): void {
    this.dealHeaderservice.sendFullLoan('false');
    this.fullWidth = false;
  }

  //To open loan.
  routeToLoanComponent(l) {
    this.loanId = l.id;
    this.router.navigateByUrl("/main/deal/" + this.dealId + "/loan/" + this.loanId);
    this.fullWidth = false;
    this.eventEmitterService.closeDropdownRequirementListFromPartyModal();
  }

  //To open new loan form.
  onReqTypeClick(reqId) {
    //debugger;
    this.req = reqId;
    this.newreqid = reqId;
    this.fullWidth = false;
    this.loanId = 0;
    this.router.navigateByUrl("/main/deal/" + this.dealId + "/loan/" + this.loanId);
    //this.eventEmitterService.onNewLoanButtonClick(req);
    this.eventEmitterService.setNewloanReqId(this.req);
  }

  //TO open exiting loan
  onExLoanClick(existingLoan: any) {
    this.fullWidth = false;
    this.router.navigateByUrl("/main/deal/" + existingLoan.dealId + "/loan/" + existingLoan.id);
    this.eventEmitterService.closeDropdownRequirementListFromPartyModal();
  }
  onActivate(componentReference) {

    //componentReference.newreqid;
    componentReference.anyFunction(this.newreqid);
  }


  //For cloud icon on Loan list.
  cloudIconDropdown() {
    this.loLinksCal = [
      {
        text: 'Commercial Loans',
        url: 'https://teams.alpinebank.com/loans/Lists/CommLoanProcCal/Calendar1.aspx',
        icon: 'fa-calendar'
      },
      {
        text: 'Consumer Loans',
        url: 'https://teams.alpinebank.com/loans/Lists/ConsLoanProcCal/Calendar1.aspx',
        icon: 'fa-calendar'
      },
      {
        text: 'Loan Committee',
        url: 'https://thepeek.alpinebank.com/support/loans/Lists/LoanMeetingSchedule1/calendar.aspx',
        icon: 'fa-calendar'
      }
    ];

    this.loLinksConst = [
      {
        text: 'Contractor Reference',
        url: 'https://teams.alpinebank.com/loans/Lists/CommLoanProcCal/Calendar1.aspx',
        icon: 'fa-file-pdf'
      },
      {
        text: 'Cost Analysis',
        url: 'https://teams.alpinebank.com/loans/Lists/ConsLoanProcCal/Calendar1.aspx',
        icon: 'fa-file-excel'
      },
      {
        text: 'Officer Checklist',
        url: 'https://thepeek.alpinebank.com/support/loans/Lists/LoanMeetingSchedule1/calendar.aspx',
        icon: 'fa-file-pdf'
      }
    ];
    this.loLinksMisc = [
      {
        text: 'Ability to Repay (ATR)',
        url: 'http://thepeek.alpinebank.com/support/loans/LoanDocsFiles/ATR%20-%20HELOAN,%20ETC.pdf#search=atr',
        icon: 'fa-file-pdf'
      },
      {
        text: 'AFT Auth. Request',
        url: 'https://thepeek.alpinebank.com/support/loans/LoanDocsFiles/Automatic%20Transfer%20Authorization%2002-14-2017.pdf',
        icon: 'fa-file-pdf'
      },
      {
        text: 'LE Checklist',
        url: 'https://thepeek.alpinebank.com/support/loans/LoanDocsFiles/Loan%20Estimate%20Checklist.pdf',
        icon: 'fa-file-pdf'
      },
      {
        text: 'NOAT',
        url: 'https://thepeek.alpinebank.com/support/loans/Lists/LoanMeetingSchedule1/calendar.aspx',
        icon: 'fa-file-pdf'
      },
      {
        text: 'NOAT Condition Letter',
        url: 'https://thepeek.alpinebank.com/support/loans/LoanDocsFiles/Notice%20of%20Action%20Taken%20-%20Condition%20Letter.pdf',
        icon: 'fa-file-pdf'
      },

    ];
  }

  //To Remove Loan.
  onRemoveClick(loan) {
    
    if (loan.primary === true) {
      this.modalRef = this.confirmService.openErrorModal("Primary Loan", "You can not remove primary loan");
      this.modalRef.componentInstance.onCloseClick.subscribe(data => {
        
        this.fullWidth = true;
        this.modalRef.close();
      });
    } else {
      if (loan.collateralCount === 0) {
        this.modalRef = this.confirmService.openRemoveLoanConfirmationModal('LOAN', 'Are you sure you want to remove this loan?', false);
        this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {
          this.modalRef.close();
        });
        this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {

          this.loanService.removeLoan(this.loanId).subscribe(data => {
            
            this.fullWidth = true;
            this.refreshLoanList();
            this.bindExistingLoan();
            //this.eventEmitterService.setloanlist(this.dealId);
            //this.eventEmitterService.onNonExistingloan();
            this.modalRef.close();
          });
        });
      }
      if (loan.collateralCount > 0) {
        this.modalRef = this.confirmService.openRemoveLoanConfirmationModal('LOAN', ' Loan is associated with collateral. Please remove from collateral first.', true);
        this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {
          
          this.fullWidth = true;
          this.modalRef.close();
        });
        this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
          
          this.fullWidth = true;
          this.modalRef.close();
        });
      }
    }

  }

  //For Cloud Icon Dropdown items.
  openloanDocs() {
    window.open("https://thepeek.alpinebank.com/support/loans/LoanDocsFiles/Forms/ByCategory.aspx");
  }
  openConstDocs(lc) {
    window.open(lc.url);
  }

  openCalenderDocs(exl) {
    window.open(exl.url);
  }


  openForms(lmc) {
    window.open(lmc.url);
  }

  //To Refresh Loan List.
  refreshLoanList() {
    this.loanService.getLoansForDeal(this.dealId).subscribe(res => {
      this.loanData = res;
    });
  }

  //To bind Existing Loan.
  bindExistingLoan() {
    this.loanService.getAvailableLoans(this.dealId).subscribe(data => {
      this.exstingLoanType = data;
    });
  }
}
