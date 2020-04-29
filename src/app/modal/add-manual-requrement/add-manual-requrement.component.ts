import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RequirementServiceProxy, DocumentServiceProxy, LoanServiceProxy, RequirementCustomModel } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-manual-requrement',
  templateUrl: './add-manual-requrement.component.html',
  styleUrls: ['./add-manual-requrement.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddManualRequrementComponent implements OnInit {
  @Input() currentDeal: any;
  // @Input() documents: any;
  @Output() onRequirmentsave: EventEmitter<any> = new EventEmitter();
  @Input() isOpenFromDocPortlet: boolean;
  @Input() currentDoc: any;
  Entities: Array<any> = [];
  userId: string;
  dealRequirement: Array<any> = [];
  SelectedDealRequirement: Array<any> = [];
  searchReqs: string;
  ShowDealRequirement: boolean = false;
  ReqEntityType: any;
  SelectedEntity: any;
  SaveButtonCondition: boolean;
  primaryLoanRequestType: any;
  requirementSelectForm: FormGroup;
  requirementSelect = new FormControl();
  selectedValue: string;
  @ViewChild('mySelect') mySelect:any; 


  
  constructor(private requirementservice: RequirementServiceProxy,
    private store: Store<AppState>,
    private DocumentServiceProxy: DocumentServiceProxy,
    public activeModal: NgbActiveModal,
    private LoanServiceProxy: LoanServiceProxy,
    private documentService: DocumentServiceProxy) {


  }

  ngOnInit() {
    this.store.select(state => state.currentUser).subscribe(result => {
      this.userId = result.userId;
    });

    this.requirementservice.getAllRequirementEntities(this.currentDeal).subscribe((res: any) => {
      this.Entities = res;
    });

    this.LoanServiceProxy.getLoansForDeal(this.currentDeal)
      .subscribe((data) => {
        if (data) {
          data.forEach(value => {
            if (value.primary == true) {
              this.primaryLoanRequestType = value.requestType;
            }
          });
        }
      });

  }

  
  


  getRequirements(entity, ReqEntityType) {
    
    this.searchReqs = '';
    this.SelectedEntity = entity;

    this.ReqEntityType = ReqEntityType;
    this.requirementservice.getManualRequirementDefinition(ReqEntityType, this.userId).subscribe((res: any) => {
      this.dealRequirement = res;
      
      this.dealRequirement.forEach((value: any) => {
        if (value && value.type && value.name) {
          value.displayValue = value.name + ' ' + value.type;
        }
      });
      this.ShowDealRequirement = true;
      
    });
  }

  getDealReqs(reqs) {
    if (reqs.length !== 0) {
      this.SaveButtonCondition = true;
    }
  }
  onSelectedOptionsChange(dealRequirement){
    
  }

  SaveRequirement() {
    
    this.SelectedDealRequirement.forEach((req: any) => {
      req.createdBy = this.userId;
      if (this.ReqEntityType) {
        switch (this.ReqEntityType) {
          case 'pa':
            //req = req;
            req.partyId = this.SelectedEntity.id;
            req.reqDealId = this.currentDeal;
            break;
          case 'lo':
            //req = $scope.loanRequirement;
            req.loanId = this.SelectedEntity.id;
            req.reqDealId = this.currentDeal;
            break;
          case 'co':
            //req = $scope.collateralRequirement;
            req.collateralId = this.SelectedEntity.id;
            req.reqDealId = this.currentDeal;
            break;
          case 'dl':
            //req = $scope.dealRequirement;
            req.dealId = this.SelectedEntity.dealId;
            req.reqDealId = this.currentDeal;
            break;
        }
      }

      if (req)
        req.loanRequestType = this.primaryLoanRequestType;
      this.requirementservice.post(req).subscribe((data) => {
        // if (!data.error) {
        //     switch (this.ReqEntityType) {
        //         case "lo":
        //             $scope.$emit('refreshLoan', this.currentDeal);
        //             break;
        //         case "pa":
        //             $scope.$emit('refreshParty', this.currentDeal);
        //             break;
        //         case "co":
        //             $scope.$emit('refreshCollateral', this.currentDeal);
        //             break;
        //     }
        //     $emit('refreshRequirement', this.currentDeal);
        //     $emit('refreshEvents', this.currentDeal);
        //     editMode = false;
        //     $emit('closeRequirementAdd');
        // }
        // else {
        //     $scope.requirement.saveValidationError = data.error;
        // }
        if (this.isOpenFromDocPortlet == true) {
          if(data.statusDescription == null) {
            data.statusDescription = ''
          }
          // var documentRequirement = {};
          // documentRequirement.documentId = this.currentDoc.id;
          // documentRequirement.requirementId = data.req.requirementId;
          // $scope.editDocument.documentDefinitionId = $scope.documentDefinitionId;
          this.currentDoc.documentDefinitionId = data.documentDefinitionId;
          // $scope.editDocument.id = $scope.editDocId;
          //if (!$scope.editDocument.attachedRequirements)
          // this.currentDoc.attachedRequirements = [];
          data.documentId = this.currentDoc.id;
          this.currentDoc.attachedRequirements.push(data);
          this.documentService.updateDocument(this.currentDoc).subscribe((data) => {
            this.currentDoc.documentDefinitionName = data.documentDefinitionName;
            this.documentService.getDocumentById(this.currentDoc.dealId,this.currentDoc.id).subscribe((data) => {
            this.currentDoc.attachedRequirements = data.attachedRequirements;
            this.activeModal.close();
          });
            // $scope.activateDocuments();
            // if (this.currentDoc.id) {
            //     this.documentService.getDocumentById(this.currentDeal, this.currentDoc.id).subscribe((doc)=> {

            //         var document = $scope.setDealDocument(this.currentDeal, this.currentDoc.id, doc);
            //         angular.element("#table-" + $scope.documentid + " .dirty").removeClass("dirty");
            //     });
            // }
          });

          // documentService.SaveDocumentRequirement(documentRequirement).then(function (data) { });
        }

        else {
          this.onRequirmentsave.emit();

        }

      });
    });
  }

  public entityChanged(ev) {
    this.SelectedDealRequirement=[]
  }

  // public resetForms() {
  //   this.SaveButtonCondition = false
  //   this.dealRequirement = []
  //   this.selected = []
  // }

}
