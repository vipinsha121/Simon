import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { PartyServiceProxy, CodeServiceProxy, LoanServiceProxy, AdmLoanProductServiceProxy, LoanDetailsDto, RequirementServiceProxy, DocumentServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import * as _moment from 'moment';
import { EventEmitterService } from '../../party-modal/party-form/party-form-service/event-emitter.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { Subscription } from 'rxjs';
import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';

const moment = _moment;
export interface State {
  id: number;
  name: string;
  abbrv: string;
}
@Component({
  selector: 'loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // providers: [
  //   { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  //   { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  // ],
})
export class LoanFormComponent implements OnInit {


  @Input() loan: any;
  subjectLoan: Subscription;
  editModeProduct: boolean;
  editModePricing: boolean;
  editModeDates: boolean;
  editModeClosing: boolean;
  loanDetailsForm: FormGroup;
  loanPricingForm: FormGroup;
  loanDatesForm: FormGroup;
  loanMoreForm: FormGroup;
  editMode: boolean;
  loandetails: LoanDetailsDto = new LoanDetailsDto();
  openRequirements: number = 0;
  completeRequirement: number = 0;
  dealId: number = 0;
  loanId: number = 0;
  requirements: Array<any> = [];
  productsType: Array<any> = [];
  purposeType: Array<any> = [];
  purposeSecondary: Array<any> = [];
  departmentType: Array<any> = []; reqDocuments: any;
  categoryType: Array<any> = [];
  reqType: Array<any> = []; isLoading: boolean; requirementDetails: any;
  financingType: Array<any> = []; isNewloan: boolean = false; disablePricing: boolean = false;
  probabilityType: Array<any> = []; primarytabclass: number = 0; producttabactive: number = 0;
  initialfixed: Array<any> = []; fullWidth: boolean;
  paymenttype: Array<any> = []; primaryloan: boolean; formDisabled: boolean;
  loantovaluetype: Array<any> = []; modalRef: NgbModalRef; IsFromLoan: boolean = true;
  pricingIndexType: Array<any> = []; escrowType: Array<any> = []; feesType: Array<any> = []; checked = false;
  indeterminate = false; labelPosition = 'after'; disabled = false; isLoanPrimary: boolean;
  consumerPricing: boolean; consumerNonRealEstate: boolean; feeEdit: boolean; selected = new FormControl(0);

  //States
  stateList: State[] = [
    {
      id: 1,
      name: 'Colorado',
      abbrv: 'CO'
    },
    {
      id: 2,
      name: 'Alabama',
      abbrv: 'AL'
    },
    {
      id: 3,
      name: 'Alaska',
      abbrv: 'AK'
    },
    {
      id: 4,
      name: 'Arizona',
      abbrv: 'AZ'
    },
    {
      id: 5,
      name: 'Arkansas',
      abbrv: 'AR'
    },
    {
      id: 6,
      name: 'California',
      abbrv: 'CA'
    },
    {
      id: 7,
      name: 'Connecticut',
      abbrv: 'CT'
    },
    {
      id: 8,
      name: 'Delaware',
      abbrv: 'DE'
    },
    {
      id: 9,
      name: 'Florida',
      abbrv: 'FL'
    },
    {
      id: 10,
      name: 'Georgia',
      abbrv: 'GA'
    },
    {
      id: 11,
      name: 'Hawaii',
      abbrv: 'HI'
    },
    {
      id: 12,
      name: 'Idaho',
      abbrv: 'ID'
    },
    {
      id: 13,
      name: 'Illinois',
      abbrv: 'IL'
    },
    {
      id: 14,
      name: 'Indiana',
      abbrv: 'IN'
    },
    {
      id: 15,
      name: 'Iowa',
      abbrv: 'IA'
    },
    {
      id: 16,
      name: 'Kansas',
      abbrv: 'KS'
    },
    {
      id: 17,
      name: 'Kentucky',
      abbrv: 'KY'
    },
    {
      id: 18,
      name: 'Louisiana',
      abbrv: 'LA'
    },
    {
      id: 19,
      name: 'Maine',
      abbrv: 'ME'
    },
    {
      id: 20,
      name: 'Maryland',
      abbrv: 'MD'
    },
    {
      id: 21,
      name: 'Massachusetts',
      abbrv: 'MA'
    },
    {
      id: 22,
      name: 'Michigan',
      abbrv: 'MI'
    },
    {
      id: 23,
      name: 'Minnesota',
      abbrv: 'MN'
    },
    {
      id: 24,
      name: 'Mississippi',
      abbrv: 'MN'
    },
    {
      id: 25,
      name: 'Missouri',
      abbrv: 'MO'
    },
    {
      id: 26,
      name: 'Montana',
      abbrv: 'MT'
    },
    {
      id: 27,
      name: 'Nebraska',
      abbrv: 'NE'
    },
    {
      id: 28,
      name: 'Nevada',
      abbrv: 'NV'
    },
    {
      id: 29,
      name: 'New Hampshire',
      abbrv: 'NH'
    },
    {
      id: 30,
      name: 'New Jersey',
      abbrv: 'NJ'
    },
    {
      id: 31,
      name: 'New Mexico',
      abbrv: 'NM'
    },
    {
      id: 32,
      name: 'New York',
      abbrv: 'NY'
    },
    {
      id: 33,
      name: 'North Carolina',
      abbrv: 'NC'
    },
    {
      id: 34,
      name: 'North Dakota',
      abbrv: 'ND'
    },
    {
      id: 35,
      name: 'Ohio',
      abbrv: 'OH'
    },
    {
      id: 36,
      name: 'Oklahoma',
      abbrv: 'OK'
    },
    {
      id: 37,
      name: 'Oregon',
      abbrv: 'OR'
    },
    {
      id: 38,
      name: 'Pennsylvania',
      abbrv: 'PA'
    },
    {
      id: 39,
      name: 'Rhode Island',
      abbrv: 'RI'
    },
    {
      id: 40,
      name: 'South Carolina',
      abbrv: 'SC'
    },
    {
      id: 41,
      name: 'South Dakota',
      abbrv: 'SD'
    },
    {
      id: 42,
      name: 'Tennessee',
      abbrv: 'TN'
    },
    {
      id: 43,
      name: 'Texas',
      abbrv: 'TX'
    },
    {
      id: 44,
      name: 'Utah',
      abbrv: 'UT'
    },
    {
      id: 45,
      name: 'Vermont',
      abbrv: 'VT'
    },
    {
      id: 46,
      name: 'Virginia',
      abbrv: 'VA'
    },
    {
      id: 47,
      name: 'Washington',
      abbrv: 'WA'
    },
    {
      id: 48,
      name: 'West Virginia',
      abbrv: 'WV'
    },
    {
      id: 49,
      name: 'Wisconsin',
      abbrv: 'WI'
    },
    {
      id: 50,
      name: 'Wyoming',
      abbrv: 'WY'
    },
    {
      id: 51,
      name: 'District of Columbia',
      abbrv: 'DC'
    }
  ];

  // //For Date validation.
  // appdate = new FormControl(moment([2017, 0, 1]));
  // appcmpldate = new FormControl(moment([2017, 0, 1]));
  // acttakendate = new FormControl(moment([2017, 0, 1]));
  // respadatevalid = new FormControl(moment([2017, 0, 1]));
  // cicdatevalid = new FormControl(moment([2017, 0, 1]));
  // contractdatevalid = new FormControl(moment([2017, 0, 1]));
  // closingdatevalid = new FormControl(moment([2017, 0, 1]));
  // lncommeteedatevalid = new FormControl(moment([2017, 0, 1]));
  // docsneededdatevalid = new FormControl(moment([2017, 0, 1]));
  // laserprocdatevalid = new FormControl(moment([2017, 0, 1]));

  snackBarRef: any;
  configSuccess: MatSnackBarConfig = {
    panelClass: 'u-background-green-light',
  };
  configCancel: MatSnackBarConfig = {
    panelClass: 'u-background-red',
  };

  constructor(private activatedRoute: ActivatedRoute,
    private loanService: LoanServiceProxy,
    private codeService: CodeServiceProxy,
    public confirmService: confirmModalPopupService,
    private fb: FormBuilder,
    private admloanservice: AdmLoanProductServiceProxy,
    private cdr: ChangeDetectorRef,
    private eventEmitterService: EventEmitterService,
    private requirementService: RequirementServiceProxy,
    private documentService: DocumentServiceProxy,
    private snackBar: MatSnackBar) {

    activatedRoute.parent.parent.params.subscribe(params => {
      this.dealId = params["dealId"];
    });

    //To open Existin Loan.
    activatedRoute.params.subscribe(params => {
      this.loanId = params["loanId"];
      if (this.loanId > 0) {
        this.isLoading = true;
        this.loandetails = new LoanDetailsDto();
        loanService.getLoanDetails(this.dealId, this.loanId).subscribe(loanRes => {

          this.loandetails = loanRes;
          this.loandetails.departmentId = loanRes.departmentId.toString();
          this.loandetails.productId = loanRes.productId.toString();
          this.primaryloan = loanRes.primary;
          this.editMode = false;
          this.isNewloan = false;
          this.producttabactive = 0;
          if (this.loandetails.departmentId == 1) {
            this.consumerNonRealEstate = false;
            this.consumerPricing = false;
            this.disablePricing = false;
          }
          if (this.loandetails.departmentId == 2) {
            this.consumerPricing = true;
            this.consumerNonRealEstate = false;
            this.disablePricing = false;
          }
          if (this.loandetails.departmentId == 11) {
            this.consumerNonRealEstate = true;
            this.consumerPricing = false;
            this.disablePricing = true;
          }

          this.isLoading = false
          this.toggleEditProduct();
          this.bindPricingDropdown();
          this.bindEscrowDrowdown();
          this.bindFinancingType();
          this.bindRequirements();
          this.bindDocuments();
        });
      }
    });
    this.bindAllDropdowns();
  }

  //To show message for save and cancel.
  openSnackBarSave(message, action) {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Loan Form Saved',
      duration: 2000,
      ...this.configSuccess
    });
  }

  openSnackBarCancel() {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Loan Form Changes Cancelled',
      duration: 2000,
      ...this.configCancel
    });
  }


  //For form validations
  private buildForms() {
    this.loanDetailsForm = new FormGroup({
      product: new FormControl(this.loandetails.productName, Validators.required),
      amount: new FormControl(this.loandetails.amount, [
        Validators.required,
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(100000000000),
        Validators.min(1)
      ]),
      purposePrimary: new FormControl(this.loandetails.purposePrimaryName,
        Validators.required
      ),
      purposeSecondary: new FormControl(this.loandetails.purposeSecondaryName),
      department: new FormControl(this.loandetails.departmentName,
        Validators.required
      ),
      requestType: new FormControl(this.loandetails.requestType,
        Validators.required
      ),
      category: new FormControl(this.loandetails.categoryName),
      financing: new FormControl(this.loandetails.financingTypeCode,
        Validators.required
      ),
      probability: new FormControl(this.loandetails.probabilityText,
        Validators.required
      ),
      loanNum: new FormControl(this.loandetails.loanNumber, [
        Validators.max(10000000000)
      ]),
      dpcq: new FormControl(this.loandetails.decisionpronumber, [
        Validators.pattern('^[0-9]+$'),
        Validators.max(100000000000)
      ]),
      rushchk: new FormControl(this.loandetails.rush),
      loanestchk: new FormControl(this.loandetails.loanEstimate),
      primaryloanchk: new FormControl(this.loandetails.primary),
      owneroccupiedchk: new FormControl(this.loandetails.owneroccupiedflag),
    });

    this.loanPricingForm = new FormGroup({
      rate: new FormControl(this.loandetails.noteRate, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(1000000)
      ]),
      margin: new FormControl(this.loandetails.spreadRate, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(1000000)
      ]),
      initalfixperiod: new FormControl(this.loandetails.initialfixedtext),
      ratefloor: new FormControl(this.loandetails.floorRate, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(1000000)
      ]),
      termmonths: new FormControl(this.loandetails.term, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(10000)
      ]),
      amortization: new FormControl(this.loandetails.amortTerm, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(10000)
      ]),
      feeamount: new FormControl(this.loandetails.feestext,
        Validators.pattern('^([0-9]*\.)?[0-9]+$')
      ),
      feepaymenttype: new FormControl(this.loandetails.paymentMethod),
      pricingCmt: new FormControl(this.loandetails.pricingComment),
      pricingindexdrop: new FormControl(this.loandetails.pricingIndextext),
      estDeposit: new FormControl(this.loandetails.depositExpected, [
        Validators.pattern('^([0-9]*\.)?[0-9]+$'),
        Validators.max(100000000)
      ]),
      loantovaluetype: new FormControl(this.loandetails.loantovaluetext),
      interestonlychk: new FormControl(this.loandetails.interestOnly),
      fees: new FormControl(this.loandetails.feeRange)
    });

    this.loanDatesForm = new FormGroup({
      appdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      appcompletedate: new FormControl('', CustomValidatorsComponent.isDateValid),
      actiondate: new FormControl('', CustomValidatorsComponent.isDateValid),
      respadate: new FormControl('', CustomValidatorsComponent.isDateValid),
      cicdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      contractdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      closingdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      lncommiteedate: new FormControl('', CustomValidatorsComponent.isDateValid),
      docsneededdate: new FormControl('', CustomValidatorsComponent.isDateValid),
      laserprodocdate: new FormControl('', CustomValidatorsComponent.isDateValid),
    });

    this.loanDatesForm.get('appdate').markAsTouched();
    this.loanDatesForm.get('closingdate').markAsTouched();

    this.loanMoreForm = new FormGroup({
      closingcmt: new FormControl(this.loandetails.closingComments),
      laserpro: new FormControl(this.loandetails.lpTransNo),
      EscrowTax: new FormControl(this.loandetails.escrowtext),
      closeAtTitleCochk: new FormControl(this.loandetails.closeAtTitleCo),
      aftprotac: new FormControl(this.loandetails.aftProtAcct),
      intendeduseoffunds: new FormControl(this.loandetails.intendedUseOfFunds),
      comments: new FormControl(this.loandetails.comment),
      description: new FormControl(this.loandetails.description),
      address1: new FormControl(this.loandetails.address1),
      address2: new FormControl(this.loandetails.address2),
      city: new FormControl(this.loandetails.city),
      state: new FormControl(this.loandetails.state),
      zip: new FormControl(this.loandetails.zip),
    });

    this.loanDetailsForm.get('product').markAsTouched();
    this.loanDetailsForm.get('amount').markAsTouched();
    this.loanDetailsForm.get('purposePrimary').markAsTouched();
    this.loanDetailsForm.get('requestType').markAsTouched();
    this.loanDetailsForm.get('probability').markAsTouched();
    this.loanDetailsForm.get('financing').markAsTouched();

  }

  ngOnInit() {
    if (this.loanId > 0) { }

    //To Open new loan form.
    this.subjectLoan = this.eventEmitterService.getNewloanReqId().subscribe(data => {

      if (data) {
        this.primarytabclass = 3;
        this.producttabactive = 0;
        this.loandetails = new LoanDetailsDto();
        this.requirements = [];
        this.productsType = [];
        this.purposeType = [];
        this.purposeSecondary = [];
        this.financingType = [];
        this.openRequirements = 0;
        this.completeRequirement = 0;
        this.loandetails.requestType = data;
        this.bindPricingDropdown();
        this.bindEscrowDrowdown();
        this.isNewloan = true;
        this.primaryloan = false;
        this.consumerNonRealEstate = false;
        this.consumerPricing = false;
        this.disablePricing = false;
      }
    });

    this.buildForms();

  }
  // GET PRODUCT FORM DETAILS
  get product() {
    return this.loanDetailsForm.get('product');
  }

  get amount() {
    return this.loanDetailsForm.get('amount');
  }

  get purposePrimary() {
    return this.loanDetailsForm.get('purposePrimary');
  }

  get purposeSecondaryDetail() {
    return this.loanDetailsForm.get('purposeSecondary');
  }

  get department() {
    return this.loanDetailsForm.get('department');
  }

  get requestType() {
    return this.loanDetailsForm.get('requestType');
  }

  get category() {
    return this.loanDetailsForm.get('category');
  }

  get financing() {
    return this.loanDetailsForm.get('financing');
  }

  get probability() {
    return this.loanDetailsForm.get('probability');
  }

  get loanNum() {
    return this.loanDetailsForm.get('loanNum');
  }

  get dpcq() {
    return this.loanDetailsForm.get('dpcq');
  }

  get estDeposit() {
    return this.loanPricingForm.get('estDeposit');
  }

  get rate() {
    return this.loanPricingForm.get('rate');
  }

  get margin() {
    return this.loanPricingForm.get('margin');
  }

  get ratefloor() {
    return this.loanPricingForm.get('ratefloor');
  }

  get termmonths() {
    return this.loanPricingForm.get('termmonths');
  }

  get amortization() {
    return this.loanPricingForm.get('amortization');
  }

  //To bind Product,primary,secondary dropdown 
  toggleEditProduct() {
    this.codeService.getDropdownData("admloanproduct").subscribe(result => {
      var prdcode = null;
      var primaryPurpose = null;
      this.productsType = result;
      if (this.loandetails.productId) {
        prdcode = this.productsType.filter(data => {
          return data.id == this.loandetails.productId
        })
        this.admloanservice.getProductPurposeCodes(prdcode[0].productCode).subscribe(result => {
          this.purposeType = result;
          if (this.purposeType && this.purposeType.length > 0) {
            primaryPurpose = this.purposeType.filter(data => {
              if (this.loandetails.purposePrimary)
                return data.purposeCode == this.loandetails.purposePrimary;
              else
                return null;
            });
            if (primaryPurpose && primaryPurpose.length > 0) {

              var cleanProductCode = encodeURIComponent(prdcode[0].productCode);
              var cleanPrimaryPurposeCode = encodeURIComponent(primaryPurpose[0].purposeGroup);
              this.admloanservice.getProductSecondaryPurposeCodes(cleanProductCode, cleanPrimaryPurposeCode).subscribe(result => {
                this.purposeSecondary = result;
              })
            }
          }
        })
      }
    });
  }

  //To bind Pricing Dropdown.
  toggleEditPricing() {
    this.editModePricing = !this.editModePricing;
    this.bindPricingDropdown();
  }

  toggleEditDates() {
    this.editModeDates = !this.editModeDates;
  }

  //To bind Escrow dropdown.
  toggleEditClosing() {
    this.editModeClosing = !this.editModeClosing;
    this.bindEscrowDrowdown();
  }

  //Dropdown Change events.
  onValChange(department: any) {
    this.purposeType = [];
    this.purposeSecondary = [];
    this.productsType = [];
    this.financingType = [];
    this.loandetails.productId = null;

    this.codeService.getDropdownData("LnFinancingTypeCode").subscribe(result => {

      this.financingType = result.filter(data => {
        if (data.code && department && department.code)
          return data.code.indexOf(department.code) >= 0;
        else
          return null;
      })
    });

    this.codeService.getDropdownData("admloanproduct").subscribe(result => {

      this.productsType = result.filter(data => {
        if (data.departmentId && department && department.id)
          return data.departmentId.toString().indexOf(department.id) >= 0
        else
          return null;
      })
    });
    if (department.code == "RE") {
      this.consumerPricing = true;
      this.consumerNonRealEstate = false;
      this.disablePricing = false;
    }
    if (department.code == "CN") {
      this.consumerNonRealEstate = true;
      this.consumerPricing = false;
      this.disablePricing = true;
    }
    if (department.code == "CL") {
      this.consumerNonRealEstate = false;
      this.consumerPricing = false;
      this.disablePricing = false;
    }

  }

  //Product Dropdown change events.
  onProductChange(product: any) {

    this.purposeType = [];
    this.purposeSecondary = [];
    this.loandetails.purposePrimary = null;
    this.loandetails.purposeSecondary = null;
    var prod = this.productsType.filter(data => {
      if (product.value && product)
        return data.id == product.value;
      else
        return null;
    })
    if (prod.length > 0) {
      this.admloanservice.getProductPurposeCodes(prod[0].productCode).subscribe(result => {
        this.purposeType = result;
      })
    }
  }

  //Purpose Dropdown change events.
  onPurposeChange(purpose: any) {
    this.purposeSecondary = [];
    this.loandetails.purposeSecondary = null;
    var prod = this.productsType.filter(data => {
      if (this.loandetails.productId)
        return data.id == this.loandetails.productId;
      else
        return null;
    })
    var primaryPurpose = null;
    if (this.purposeType && this.purposeType.length > 0) {
      primaryPurpose = this.purposeType.filter(data => {
        if (this.loandetails.purposePrimary)
          return data.purposeCode == purpose.value;
        else
          return null;
      });
    }
    if (primaryPurpose && primaryPurpose.length > 0) {
      var cleanProductCode = encodeURIComponent(prod[0].productCode);
      var cleanPrimaryPurposeCode = encodeURIComponent(primaryPurpose[0].purposeGroup);
      this.admloanservice.getProductSecondaryPurposeCodes(cleanProductCode, cleanPrimaryPurposeCode).subscribe(result => {
        this.purposeSecondary = result;
      })
    }
    else { this.purposeSecondary = []; }
  }

  //Fees dropdown change event.
  changeAmount() {
    var fee = this.feesType.filter(data => {
      return data.id == this.loandetails.feeRange;
    });
    if (fee) {
      var type = fee[0].type;
      var value = fee[0].value;
      if (type.toLowerCase() == 'calc') {
        this.loandetails.fee = parseFloat((this.loandetails.amount * value).toFixed(2));
        this.feeEdit = true;
      }
      else {
        this.feeEdit = false;
        this.loandetails.fee = null;
      }
    }
  }

  onFeeChange(fees: any) {
    var fee = this.feesType.filter(data => {
      return data.id == this.loandetails.feeRange;
    });
    var value = fee[0].value;
    value = parseFloat(value).toFixed(2);
  }

  //To save loan.
  saveLoanDetails() {
    if (this.isNewloan == false) {
      this.loandetails.active = true;
      this.isLoading = true;
      this.loanService.saveLoan(this.loandetails).subscribe(data => {
        if (data) {
          this.loanService.getLoanDetails(this.dealId, this.loanId).subscribe(loanRes => {
            this.loandetails = loanRes;
            this.loandetails.departmentId = loanRes.departmentId.toString();
            this.loandetails.productId = loanRes.productId.toString();
            this.primaryloan = loanRes.primary;
            this.producttabactive = 0;
            if (this.loandetails.departmentId == 1) {
              this.consumerNonRealEstate = false;
              this.consumerPricing = false;
              this.disablePricing = false;
            }
            if (this.loandetails.departmentId == 2) {
              this.consumerPricing = true;
              this.consumerNonRealEstate = false;
              this.disablePricing = false;
            }
            if (this.loandetails.departmentId == 11) {
              this.consumerNonRealEstate = true;
              this.consumerPricing = false;
              this.disablePricing = true;
            }
            this.isLoading = false;
            //debugger;
            this.eventEmitterService.onSetNavbarDates(this.loandetails);
            this.eventEmitterService.setloanlist(this.dealId);
            //this.eventEmitterService.onRemoveLoanButtonClick();
            this.eventEmitterService.onNonExistingloan();

          });
        }
      });
    }
    else {
      this.loandetails.dealId = this.dealId;
      this.loandetails.active = true;
      this.isLoading = true;
      this.loanService.saveNewLoan(this.loandetails).subscribe(data => {
        if (data) {
          this.isNewloan = false;
          this.producttabactive = 0;
          //this.resetFlags();
          if (this.loandetails.departmentId == 1) {
            this.consumerNonRealEstate = false;
            this.consumerPricing = false;
            this.disablePricing = false;
          }
          if (this.loandetails.departmentId == 2) {
            this.consumerPricing = true;
            this.consumerNonRealEstate = false;
            this.disablePricing = false;
          }
          if (this.loandetails.departmentId == 11) {
            this.consumerNonRealEstate = true;
            this.consumerPricing = false;
            this.disablePricing = true;
          }
          this.isLoading = false;
          //debugger;
          this.eventEmitterService.onSetNavbarDates(this.loandetails);
          //this.eventEmitterService.onUpdateNavbarDates();
          //this.eventEmitterService.onRemoveLoanButtonClick();
          this.eventEmitterService.setloanlist(this.dealId);
        }
      })
    }

  }

  //Cancel button Click event.
  onCancelClick() {
    //debugger;
    if (this.isNewloan == false) {
      this.isLoading = true;
      this.loanService.getLoanDetails(this.dealId, this.loanId).subscribe(loanRes => {

        this.loandetails = loanRes;
        this.loandetails.departmentId = loanRes.departmentId.toString();
        this.loandetails.productId = loanRes.productId.toString();
        this.primaryloan = loanRes.primary;
        //this.editMode = false;
        if (this.loandetails.departmentId == 1) {
          this.consumerNonRealEstate = false;
          this.consumerPricing = false;
          this.disablePricing = false;
        }
        if (this.loandetails.departmentId == 2) {
          this.consumerPricing = true;
          this.consumerNonRealEstate = false;
          this.disablePricing = false;
        }
        if (this.loandetails.departmentId == 11) {
          this.consumerNonRealEstate = true;
          this.consumerPricing = false;
          this.disablePricing = true;
        }
        this.isLoading = false;
        this.producttabactive = 0;
        //this.eventEmitterService.onRemoveLoanButtonClick();
        this.eventEmitterService.setloanlist(this.dealId);

      });
    }
    else {
      this.loandetails = new LoanDetailsDto();
      //this.eventEmitterService.onRemoveLoanButtonClick();
      //debugger;
      this.eventEmitterService.setloanlist(this.dealId);
    }
  }

  //Primary loan check box change event.
  onChange(event) {
    this.formDisabled = true;
    this.cdr.detectChanges();
    if (event.checked == true) {

      this.loanService.getLoanForPrimaryCheck(this.dealId).subscribe(data => {

        this.isLoanPrimary = data;
        if (this.isLoanPrimary) {
          this.modalRef = this.confirmService.openCommonConfirmationModal('LOAN Primary - Loan Already Exist', 'Are you sure you want to switch this Loan to primary?');
          this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {

            this.loandetails.primary = false;
            this.formDisabled = false;
            this.modalRef.close();
          })
          this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
            this.loandetails.primary = true;
            this.formDisabled = false;
            this.modalRef.close();
          })
          this.modalRef.componentInstance.closeModalPopup.subscribe(d => {

            this.loandetails.primary = false;
            this.formDisabled = false;
            this.modalRef.close();
          })
        }
      });
    }
    else { this.formDisabled = false; }
  }

  //To Remove loan.
  onRemoveClick() {
    if (this.loandetails.primary == true) {
      this.modalRef = this.confirmService.openErrorModal("Primary Loan", "You can not remove primary loan");
      this.modalRef.componentInstance.onCloseClick.subscribe(data => {
        this.modalRef.close();
        //this.eventEmitterService.onRemoveLoanButtonClick();
        this.eventEmitterService.setloanlist(this.dealId);
      })
    }
    else {
      if (this.loandetails.collateralCount == 0) {
        this.modalRef = this.confirmService.openRemoveLoanConfirmationModal('LOAN', 'Are you sure you want to remove this loan?', false);
        this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {

          this.modalRef.close();
        })
        this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
          this.isLoading = true;
          this.loanService.removeLoan(this.loanId).subscribe(data => {
            //this.eventEmitterService.onRemoveLoanButtonClick();
            this.eventEmitterService.setloanlist(this.dealId);
            this.isLoading = false;
            this.eventEmitterService.onNonExistingloan();
            this.modalRef.close();
          });

        })
      }
      if (this.loandetails.collateralCount > 0) {
        this.modalRef = this.confirmService.openRemoveLoanConfirmationModal('LOAN', ' Loan is associated with collateral. Please remove from collateral first.', true);
        this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {

          this.modalRef.close();
        })
        this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
          this.modalRef.close();
        })
      }
    }

  }

  //To bind product tab dropdowns.
  bindAllDropdowns() {
    this.codeService.getDropdownData("admdepartment").subscribe(result => {
      this.departmentType = result;
    });
    this.codeService.getDropdownData("LnRequestTypeFormDropDown").subscribe(result => {
      this.reqType = result;
    });
    this.codeService.getDropdownData("LoanCategory").subscribe(result => {
      this.categoryType = result;
    });

    this.codeService.getDropdownData("PipelineProbability").subscribe(result => {
      this.probabilityType = result;
    });
    this.codeService.getDropdownData("InitialFixed").subscribe(result => {
      this.initialfixed = result;
    });
  }

  //To bind Pricing tab dropdowns.
  bindPricingDropdown() {
    this.codeService.getDropdownData("InitialFixed").subscribe(result => {
      this.initialfixed = result;
    });
    this.codeService.getDropdownData("PaymentType").subscribe(result => {
      this.paymenttype = result;
    });
    this.codeService.getDropdownData("PricingIndex").subscribe(result => {
      this.pricingIndexType = result;
    });
    this.codeService.getDropdownData("LoanToValue").subscribe(result => {
      this.loantovaluetype = result;
    });
    this.codeService.getDropdownData("fees").subscribe(result => {

      this.feesType = result;
    });
  }

  bindEscrowDrowdown() {
    this.codeService.getDropdownData("EscrowTaxesInsurance").subscribe(result => {
      this.escrowType = result;
    });
  }
  bindFinancingType() {
    this.codeService.getDropdownData("LnFinancingTypeCode").subscribe(result => {
      this.financingType = result;
    });
  }

  //For add new loan dropdown.
  anyFunction(newReqId) {

    if (newReqId) {
      this.primarytabclass = 3;
      this.producttabactive = 0;
      this.loandetails = new LoanDetailsDto();
      this.requirements = [];
      this.productsType = [];
      this.purposeType = [];
      this.purposeSecondary = [];
      this.financingType = [];
      this.openRequirements = 0;
      this.completeRequirement = 0;
      this.loandetails.requestType = newReqId;
      this.bindPricingDropdown();
      this.bindEscrowDrowdown();
      this.isNewloan = true;
      this.primaryloan = false;
      this.consumerNonRealEstate = false;
      this.consumerPricing = false;
      this.disablePricing = false;
    }
  }

  //TO bind requirements
  bindRequirements() {
    this.isLoading = true;
    this.loanService.getRequirementsForLoan(this.dealId, this.loanId).subscribe(data => {

      this.requirements = data;
      this.completeRequirement = this.requirements.filter(req => {
        return req.complete == true;
      }).length;
      this.openRequirements = this.requirements.length - this.completeRequirement;
      this.isLoading = false;
    })
  }

  //To bind documents.
  bindDocuments() {
    this.loanService.getRequirementDocumentsForLoan(this.dealId, this.loanId).subscribe(data => {
      this.reqDocuments = data;
    });
  }



  // To switch tab dynamically.
  onPrimaryTabChange(tab) {
    this.primarytabclass = tab.index;
  }
  onSecondaryTabChange(tab) {
    this.producttabactive = tab.index;
  }


}
