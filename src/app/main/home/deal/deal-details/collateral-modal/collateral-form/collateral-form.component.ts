import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, NgModel } from '@angular/forms';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { DealServiceProxy, CollateralServiceProxy, CodeServiceProxy, LoanServiceProxy, PartyServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitterService } from '../../party-modal/party-form/party-form-service/event-emitter.service';
import { Document3ModalComponent } from '../../document3-modal/document3-modal.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { MatSnackBarConfig, MatSnackBar, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from "@angular/material/select";
import { take, takeUntil } from "rxjs/operators";

export interface State {
  id: number;
  name: string;
  abbrv: string;
}

@Component({
  selector: 'collateral-form',
  templateUrl: './collateral-form.component.html',
  styleUrls: ['./collateral-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CollateralFormComponent implements OnInit {
  subjectCollateral: Subscription;
  displayedColumns: any[] = ['dealId', 'accountNumber', 'requestType', 'productDesc', 'amount',
    'role', 'stageLabel'];
  dataSource: any[];
  collateralId: number = 0;
  collateralDetailForm: FormGroup;
  colTypeGroup: Array<any> = [];
  colCategory: Array<any> = [];
  DealID: any;
  dealId;
  @Input() collateral: any;
  appraisalType: any;
  currentDealData: Deal;
  entry: any;
  addItem: any;
  snackBarRef: any;
  configSuccess: MatSnackBarConfig = {
    panelClass: 'u-background-green-light',
  };
  configCancel: MatSnackBarConfig = {
    panelClass: 'u-background-red',
  };
  modalRef: NgbModalRef;

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
  loanDropDown: any;
  loanDropDownMultiSelect: Array<any> = [];
  isSaveButtonForLoan: boolean;

  ownerDropDown: any;
  ownerDropDownMultiSelect: Array<any> = [];
  isSaveButtonForowner: boolean;
  lienPositionData: Array<any> = [];
  lienPositionText: any;
  editingData: any;
  lienPositionStore: any;
  saveCollateralDetails: any;
  testSelect: string;
  primaryCollateral: boolean;
  currentUserInfo: any;
  userId: any;
  selectedGroupCode = {};
  selectedCategoryId = {};
  isCancelClicked: boolean;
  arrPartyID: any;
  partyIdData: Array<any> = [];
  isNewCollateral: boolean = false;
  isPrimaryCollateral: boolean = false;
  isCollateralPrimary: any;
  selectedGrantor: any;
  selectedGrantorsIDList: Array<Int32Array> = [];
  collOwners = new FormControl();
  checkExixstingItemsToGrantors: Array<any> = [];
  exitingGrantorsIDs: Array<Int32Array> = [];
  updateGrantorsIDs: Array<Int32Array> = [];
  arrPushedGrantorsIDs: Array<Int32Array> = [];
  lienPositionDrop: Array<any> = [];
  collateralRequirements: any;
  collateralRequirementDocuments: any;
  ownerId: Array<Int32Array> = [];
  isSelectAllClicked: boolean;

  editField: string;
  // personList: Array<any> = [
  //   { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
  //   { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
  //   { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
  //   { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
  //   { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' },
  // ];
  // awaitingPersonList: Array<any> = [
  //   { id: 6, name: 'George Vega', age: 28, companyName: 'Classical', country: 'Russia', city: 'Moscow' },
  //   { id: 7, name: 'Mike Low', age: 22, companyName: 'Lou', country: 'USA', city: 'Los Angeles' },
  //   { id: 8, name: 'John Derp', age: 36, companyName: 'Derping', country: 'USA', city: 'Chicago' },
  //   { id: 9, name: 'Anastasia John', age: 21, companyName: 'Ajo', country: 'Brazil', city: 'Rio' },
  //   { id: 10, name: 'John Maklowicz', age: 36, companyName: 'Mako', country: 'Poland', city: 'Bialystok' },
  // ];
  completeRequirement: any;
  openRequirements: number;
  primarytabclass: number = 0;

  associatedLoanData = {
    associatedLoans: []
  }

  //public associatedLoanFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  currentCol: any;
  searchOwner: string

  constructor(private activatedRoute: ActivatedRoute,
    private collateralService: CollateralServiceProxy,
    private codeService: CodeServiceProxy,
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    public confirmService: confirmModalPopupService,
    private dealService: DealServiceProxy,
    private loanService: LoanServiceProxy,
    private partyService: PartyServiceProxy,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) {
    if (this.searchOwner == undefined) {
      this.searchOwner = '';
    }
    this.activatedRoute.parent.parent.params.subscribe(params => {
      this.dealId = params['dealId'];
    });

    this.subjectCollateral = this.eventEmitterService.getAddNewCollateral().subscribe(data => {
      if (data) {
        this.primarytabclass = 3;
        this.collateral = {};
        this.colTypeGroup = [];
        this.colCategory = []
        this.appraisalType = [];
        this.isPrimaryCollateral = false;
        this.ownerDropDownMultiSelect = [];
        this.loanDropDownMultiSelect = [];
        this.getCollateralDropDown();
        this.isNewCollateral = true;
      }
    });
    this.getCollateralDetails();
    this.collateralDetailForm = this.fb.group({
      description: ['', [Validators.required]],
      group: ['', [Validators.required]],
      category: ['', [Validators.required]],
      collateralOwners: ['', [Validators.required]],
      lienPosition: '',
      estimatedValue: '',
      primaryButton: '',
      appraisalType: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      vin: '',
      comment: '',
      primary: '',
      associatedLoan: '',
      searchLoan: '',
      subjectProperty: '',
      associatedLoans: this.fb.array([])
    });

    this.collateralDetailForm.get('group').markAsTouched()
    this.collateralDetailForm.get('category').markAsTouched()
    this.isSelectAllClicked = false;
  }

  setAssociatedLoan() {
    let control = <FormArray>this.collateralDetailForm.controls.associatedLoans;
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.associatedLoanData.associatedLoans.forEach(x => {
      control.push(this.fb.group({
        associatedLoan: x.associatedLoan,
        lienPosition: x.lienPosition
      }))
    })
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  addAssociatedLoan() {
    let control = <FormArray>this.collateralDetailForm.controls.associatedLoans;
    control.push(
      this.fb.group({
        associatedLoan: [{}],
        lienPosition: 0
      })
    )
  }

  deleteAssociatedLoan(index) {
    let control = <FormArray>this.collateralDetailForm.controls.associatedLoans;
    var value = control.at(index).value;
    this.collateral.loans = this.collateral.loans.filter(item => item !== value.associatedLoan.id);
    control.removeAt(index)
  }


  // Test code add, remove
  // updateList(id: number, property: string, event: any) {
  //   // alert("on text change or edit");
  //   const editField = event.target.textContent;
  //   this.personList[id][property] = editField;
  // }

  // remove(id: any) {
  //   this.lienPositionData.splice(id, 1);
  // }

  // add() {
  //   const person = [];
  //   this.lienPositionData.push(person);
  // }

  // changeValue(id: number, property: string, event: any) {
  //   this.editField = event.target.textContent;
  // }
  // test code ends

  getCollateralDetails() {
    this.activatedRoute.parent.parent.params.subscribe(params => {
      this.dealId = params['dealId'];
    });

    this.activatedRoute.params.subscribe(params => {
      this.collateralId = params['collateralId'];
      if (this.collateralId > 0) {
        this.collateralService.getCollateralDetails(this.dealId, this.collateralId).subscribe(colRes => {


          if (colRes != null && colRes != undefined) {
            this.primarytabclass = 0;
            this.collateral = colRes;
            this.isPrimaryCollateral = colRes.primary;
            this.exitingGrantorsIDs = colRes.owners;

            // If true then Create else update
            this.isNewCollateral = false;

            this.codeService.getDropdownData('CollateralType').subscribe(result => {
              this.colCategory = result;
            });

            // If existing/update then set groupCode and categoryId
            if (this.isNewCollateral == false) {
              if (colRes.groupCode) {
                this.selectedGroupCode = colRes.groupCode;
              }

              if (colRes.categoryId) {
                this.selectedCategoryId = colRes.categoryId;
              }
            }

            this.DealID = colRes.dealId;
            this.getCollateralDropDown();
            this.bindCollateralRequirements();
            this.bindCollateralRequirementsDocuments();
          }
        });

      }
    });
  }


  bindCollateralRequirementsDocuments() {
    this.collateralService.getRequirementDocumentsForCollateral((parseInt(this.dealId)), this.collateralId).subscribe(colReq => {
      this.collateralRequirementDocuments = colReq;
    })
  }

  bindCollateralRequirements() {
    this.collateralService.getRequirementsCollateral((parseInt(this.dealId)), this.collateralId).subscribe(colReq => {
      this.collateralRequirements = colReq;
      this.completeRequirement = this.collateralRequirements.filter(req => {
        return req.complete == true;
      }).length;
      this.openRequirements = this.collateralRequirements.length - this.completeRequirement;
    })
  }

  openSnackBarSave(message, action) {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Collateral Form Saved',
      duration: 2000,
      ...this.configSuccess
    });
  }

  openSnackBarCancel() {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: 'Collateral Form Changes Cancelled',
      duration: 2000,
      ...this.configCancel
    });
  }

  ngOnInit() {
    this.filteredBanks.next(this.loanDropDownMultiSelect.slice());

    // // listen for search field value changes
    // this.associatedLoanFilterCtrl.valueChanges
    //     .pipe(takeUntil(this._onDestroy))
    //     .subscribe(() => {
    //         this.filterBanks();
    //     });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // Sets the initial value after the filteredBanks are loaded initially
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        //this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  // protected filterBanks() {
  //     if (!this.loanDropDownMultiSelect) {
  //         return;
  //     }
  //     // get the search keyword
  //     let search = this.associatedLoanFilterCtrl.value;
  //     if (!search) {
  //         this.filteredBanks.next(this.loanDropDownMultiSelect.slice());
  //         return;
  //     } else {
  //         search = search.toLowerCase();
  //     }
  //     // filter the banks
  //     this.filteredBanks.next(
  //         this.loanDropDownMultiSelect.filter(bank => bank.productName.toLowerCase().indexOf(search) > -1)
  //     );
  // }


  getCollateralDropDown() {
    this.codeService.getDropdownData('CollateralTypeGroup').subscribe(result => {
      this.colTypeGroup = result;
    });

    this.codeService.getDropdownData('AppraisalType').subscribe(result => {
      this.appraisalType = result;
    });

    this.ownerDropDownMultiSelect = [];
    this.partyService.getPartyForDeal(this.dealId, 'internal').subscribe(res => {
      this.ownerDropDown = res;
      for (var i = 0; i < this.ownerDropDown.length; i++) {
        // Intialize entry obj
        this.entry = {};

        this.entry.name = this.ownerDropDown[i].name;
        this.entry.id = this.ownerDropDown[i].partyId;
        this.entry.ticked = false;

        // If collateral exists
        if (this.collateral.loans) {
          for (var j = 0; j < this.collateral.owners.length; j++) {
            if (this.collateral.owners[j] == this.ownerDropDown[i].id) {
              this.entry.ticked = true;
              break;
            }
          }
        }

        // Push data one buy one to collection which is ultimately binded to Associated Multi select grantor
        this.ownerDropDownMultiSelect.push(this.entry);
      }

      // Bind existing values to Grantors multi select
      this.collOwners.setValue(this.collateral.owners);

    })

    this.store.select(state => state.deal).subscribe(result => {
      this.currentDealData = result.filter(x => x.active == true)[0];
      this.dealId = parseInt(this.currentDealData.dealId);
      this.loanService.getLoansForDeal(parseInt(this.currentDealData.dealId)).subscribe(data => {
        if (data) {

          this.loanDropDown = data.filter(obj => {
            return obj.active == true || obj.active == null;
          });
          this.loanDropDownMultiSelect = [];
          this.associatedLoanData = {
            associatedLoans: []
          }
          for (var i = 0; i < this.loanDropDown.length; i++) {
            // Intialize entry obj
            this.entry = {};

            // Set required properties
            this.entry.productName = this.loanDropDown[i].id + "-" + this.loanDropDown[i].productName;
            this.entry.id = this.loanDropDown[i].id;
            this.entry.lienPositionId = null;
            this.entry.ticked = false;
            this.entry.partyId = this.loanDropDown[i].partyId;
            // If loans exists
            if (this.collateral.loans) {
              for (var j = 0; j < this.collateral.loans.length; j++) {
                // Compare loan id and set
                if (this.collateral.loans[j] == this.loanDropDown[i].id) {
                  this.entry.ticked = true;
                  this.entry.lienPositionId = this.collateral.loanLienPosition[j];
                  break;
                }
              }
            }
            // Push data one buy one to collection which is ultimately binded to Associated Multi select DDL
            this.loanDropDownMultiSelect.push(this.entry);

          }
          // Get Lien DDL data
          if (this.loanDropDownMultiSelect) {
            this.showLienPositionList(this.loanDropDownMultiSelect);
            this.prepareAssociatedLoanArray(this.loanDropDownMultiSelect);
            this.setAssociatedLoan();
          }
        }
      })
    })
  }

  // Bind category DDL on group DDL selection
  onGroupChange(group: any) {
    // Filter on selected item from DDL and
    // Then match the id with the id recieved from colTypeGroup
    var grp = this.colTypeGroup.filter(data => {
      if (group.value && group)
        return data.id == group.value;
      else
        return null;
    })
    if (grp.length > 0) {
      this.codeService.getDropdownData('CollateralType').subscribe(result => {
        this.colCategory = result.filter(function (obj) {
          if (obj.groupCode && grp.length > 0 && grp[0].name)
            return obj.groupCode.indexOf(grp[0].name) >= 0;
          else
            return false;
        });
      });
    }
  }

  // Create and Update collateral
  saveCollateral(collateral: any) {
    this.store.select(state => state.currentUser).subscribe(result => {
      this.currentUserInfo = result;
      this.userId = result.userId;
    });

    // Update existing collateral
    if (this.isNewCollateral == false) {
      this.saveCollateralDetails = collateral;
      this.saveCollateralDetails.owners.push = this.collateral.owners;
      this.saveCollateralDetails.lastModBy = this.userId;
      this.saveCollateralDetails.loans = [];
      let control = <FormArray>this.collateralDetailForm.controls.associatedLoans;
      for (let i = control.length - 1; i >= 0; i--) {
        var value = control.at(i).value;
        this.saveCollateralDetails.loans.push(value.associatedLoan.id);
        this.saveCollateralDetails.loanLienPosition[i] = control.at(i).value.lienPosition;
      }
      this.collateralService.put(this.saveCollateralDetails).subscribe(result => {
        if (result) {
          this.eventEmitterService.setCollateralList(this.currentDealData.dealId);
          // TODO : Save lien position data (later)
        }
      })
    }
    else {
      //Create a new collateral
      this.loanService.getLoansForDeal(parseInt(this.currentDealData.dealId)).subscribe(x => {
      })

      this.collateral.dealId = parseInt(this.currentDealData.dealId);
      this.saveCollateralDetails = this.collateral;
      this.saveCollateralDetails.owners.push = this.collateral.owners;
      this.saveCollateralDetails.lastModBy = this.userId;

      this.collateralService.post(this.collateral).subscribe(res => {
        this.eventEmitterService.setCollateralList(this.currentDealData.dealId);
      })
    }
  }

  // Delete collateral
  // Show message as cant remove if collateral is primary else remove
  deleteCollateral(collateralDetails: any) {
    this.primaryCollateral = collateralDetails.primary;

    if (this.primaryCollateral) {
      this.modalRef = this.confirmService.openErrorModal("Primary Collateral", "You can not remove Primary Collateral");
      this.modalRef.componentInstance.onCloseClick.subscribe(data => {
        this.modalRef.close();
        //this.eventEmitterService.onSetCloseRefreshCollateralListAddCancel(parseInt(this.currentDealData.dealId));
        this.eventEmitterService.setCollateralList(this.currentDealData.dealId);
      })
    }
    else {
      this.modalRef = this.confirmService.openConfirmationModal('Delete Collateral ', 'Are you sure you want to remove this collateral from the Deal?');
      this.modalRef.componentInstance.onConfirmClick.subscribe(r => {
        this.collateralService.delete(this.collateral.collateralId).subscribe(re => {
          this.modalRef.close();
          //this.eventEmitterService.onSetCloseRefreshCollateralListAddCancel(parseInt(this.currentDealData.dealId));
          this.eventEmitterService.setCollateralList(this.currentDealData.dealId);
        })
      })
      this.modalRef.componentInstance.onNoConfirmClick.subscribe(d => {
        this.modalRef.close();
      })
    }
  }

  // Reset data and close form
  onCancel(dealId) {
    this.eventEmitterService.setCollateralList(dealId);
  }

  // Open confirmation modal for updating primary check box. Either set primary or not
  onChange(event) {
    this.cdr.detectChanges();
    if (event.checked == true) {

      this.collateralService.getCollateralForPrimaryCheck(parseInt(this.currentDealData.dealId)).subscribe(data => {

        this.isCollateralPrimary = data;
        if (this.isCollateralPrimary) {
          this.modalRef = this.confirmService.openCommonConfirmationModal('Collateral Primary - Collateral Already Exist', 'Are you sure you want to switch this Collateral to primary?');
          this.modalRef.componentInstance.onNoremoveConfirmClick.subscribe(d => {
            this.collateral.primary = false;
            this.modalRef.close();
          })
          this.modalRef.componentInstance.onremoveConfirmClick.subscribe(d => {
            this.collateral.primary = true;
            this.modalRef.close();
          })
          this.modalRef.componentInstance.closeModalPopup.subscribe(d => {
            this.collateral.primary = false;
            this.modalRef.close();
          })
        }
      });
    }
  }


  // TODO :
  // (arg : any) , is nothing but loan object
  // loanDropDownMultiSelect : is list of loans
  showLienPositionList(loanDropDownMultiSelect: any[]) {
    this.codeService.getDropdownData('LienPosition').subscribe(lienDropData => {
      this.lienPositionDrop = lienDropData;
      loanDropDownMultiSelect.forEach(value => {
        // value.ticked == true, the loan whose Ticked property is true is pushed to lienPositionData
        if (value.ticked) {

          this.addItem = {};

          // get text here lien.lienPositionId
          this.lienPositionText = this.getLienPositionText(value.lienPositionId)

          if (!this.lienPositionText)
            this.lienPositionText = "No Lien Position Selected";

          this.addItem.id = value.id;
          this.addItem.text = this.lienPositionText;
          this.addItem.name = value.productName;
          this.addItem.lienPositionId = value.lienPositionId;
          this.addItem.originalLienPositionId = value.lienPositionId;

          // creted new this.lienPositionData
          this.lienPositionData.push(this.addItem);

        }
      });

      this.lienPositionData;
    })
  }

  getLienPositionText(lienPositionCode: any): any {
    if (!lienPositionCode) {
      return "No Lien Position Selected";
    }
    else {
      if (this.lienPositionDrop && this.lienPositionDrop.length > 0) {
        for (var i = 0, len = this.lienPositionDrop.length; i < len; i++) {
          if (this.lienPositionDrop[i].id === lienPositionCode) {
            return this.lienPositionDrop[i].name;
          }
        }
      }
    }
  }

  lienPositionEditCancel(arg: any) {
    for (var i = 0, len = this.lienPositionData.length; i < len; i++) {
      if (this.lienPositionData[i].id === arg.id) {
        arg.lienPositionId = arg.originalLienPositionId;
      }
    }

    // Set editingData[loan.id] = false
    this.editingData[arg.id] = false;

  }

  /// <summary>
  /// Open Details tab on Add new collateral
  /// Example, In order to open specific tab on button click we use following work around
  /// In UI, we set these two attributes [selectedIndex]="primarytabclass" (selectedTabChange)="onPrimaryTabChange($event)" in <mat-tab-group></<mat-tab-group>
  /// <summary>
  onPrimaryTabChange(tab) {
    this.primarytabclass = tab.index;
  }

  /// <summary>
  /// Example, when we assign deal to specific user then nav bar should get auto refresh to display the updated user name
  /// <summary>
  // refreshCollateralDetails() {
  //     if (this.eventEmitterService.refereshCancelCollateral == undefined) {
  //         this.eventEmitterService.refereshCancelCollateral = this.eventEmitterService.
  //             invokeCancelDetails.subscribe((name: string) => {
  //                 this.collateralService.getCollateralForDeal(this.dealId).subscribe(res => {
  //                     this.collateral = res;
  //                 });
  //             });
  //     }
  // }

  //For add new collateral.
  anyFunction(colid) {
    if (colid == 0) {
      this.primarytabclass = 3;
      this.collateral = {};
      this.colTypeGroup = [];
      this.colCategory = []
      this.appraisalType = [];
      this.isPrimaryCollateral = false;
      this.ownerDropDownMultiSelect = [];
      this.loanDropDownMultiSelect = [];
      this.getCollateralDropDown();
      this.isNewCollateral = true;
    }

  }

  prepareAssociatedLoanArray(loanDropDownMultiSelect: any[]) {
    loanDropDownMultiSelect.forEach(value => {
      if (this.collateral.loans) {
        for (var j = 0; j < this.collateral.loans.length; j++) {
          // Compare loan id and set
          if (this.collateral.loans[j] == value.id) {
            this.associatedLoanData.associatedLoans[j] = {};
            this.associatedLoanData.associatedLoans[j].associatedLoan = { id: value.id, productName: value.productName, lienPositionId: value.lienPositionId };
            if (value.lienPositionId == "0")
              this.associatedLoanData.associatedLoans[j].lienPosition = 0;
            else
              this.associatedLoanData.associatedLoans[j].lienPosition = value.lienPositionId == null ? 0 : value.lienPositionId;

            break;
          }
        }
      }
    });
  }

  onSelectedOptionsChange(col, event) {
    this.currentCol = col;
  }

  // Select all the Grantors i.e. check all grantors checkbox
  selectAll() {
    this.isSelectAllClicked = true;
    this.collateral.owners = [];
    this.ownerDropDownMultiSelect.forEach(value => {
      if (value.id != null) {
        this.ownerId.push(value.id);
      }
    })
    this.collateral.owners = this.ownerId;
  }

  // Returns selected grantor, when user clicks on any.
  getSelectedGrantors(event, owner) {
    this.selectedGrantor = {};
    this.selectedGrantor.id = owner.id;
    this.selectedGrantorsIDList.push(owner.id);
  }

  // Uncheck the grantor if user clicks outside or by mistake if user clicks outside the dropdown
  // For example, existing collateral count is 4 and if user selects two new more then those two will get unchecked or reset
  resetSelectedGrantors() {
    this.exitingGrantorsIDs;
    if (this.isNewCollateral == false) {
      if (this.isSelectAllClicked) {
        this.collateral.owners = this.exitingGrantorsIDs;
      }
      else {
        let difference = this.collateral.owners.filter(x => !this.selectedGrantorsIDList.includes(x));
        this.collateral.owners = difference;
        this.selectedGrantorsIDList = [];
      }
    }
    else {
      this.collateral.owners = [];
    }
  }

  selectionChanged(lnDDL: any, index: number) {
    let control = <FormArray>this.collateralDetailForm.controls.associatedLoans;
    control.at(index).setValue = lnDDL;
  }
}
