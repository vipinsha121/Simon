import { Component, OnInit, Input } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-related-documents',  
  templateUrl: './related-documents.component.html',
  styleUrls: ['./related-documents.component.css']
})
export class RelatedDocumentsComponent implements OnInit {
  @Input() docTypes: Array<any> = [];
  @Input() currentDealiD: any;
  @Input() RelatedSelectedDocuments: any = []; 

  RelatedDocForm: FormGroup;
  RequirementChecked: boolean = false;
  DocumentTypeChecked: boolean = false;
  AsOfDateChecked: boolean = false;
  CommentsChecked: boolean = false;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  EntityType: any;
  requirements: Array<any> = [];
  FilteredReq: Array<any> = [];
  entity = new FormControl('');
  serachRequirement: string;
  serachType: string;
  // SelectedDocType: any;
  SelectedRequirement: any;
  SelectedAsofdate: any;
  SelectedComment: any;
  disableSelect = new FormControl(false);

  constructor(public activeModal: NgbActiveModal,
              private requirementService: RequirementServiceProxy,
              private FormBuilder: FormBuilder) {
                // this.RelatedDocForm = this.FormBuilder.group({
                //   selectEntity: ['', [ Validators.required ]],
                //   requirement: ['', [Validators.required]],
                //   DocType: ['', [Validators.required]],
                //   comments: ['', [Validators.required]],
                //   AsOfDate: ['', [Validators.required]]
                // })
                this.RelatedDocForm = this.FormBuilder.group({
                  selectEntity: [''],
                  requirement: [{value: '', disabled: true}, Validators.required],
                  DocType: [{value: '', disabled: true}, Validators.required],
                  comments: [{value: '', disabled: true}, Validators.required],
                  AsOfDate: [{ value: '', disabled: true }, [Validators.required, CustomValidatorsComponent.isDateValid, Validators.pattern(/^(\d{1,2})[./-]\d{1,2}[./-](\d{4})$/)]],
                })
                  //, Validators.pattern('^(\d{2}|\d{4})[./-]\d{2}[./-](\d{4}|\d{2})$')
    this.RelatedDocForm.get('selectEntity').markAsTouched();
    this.RelatedDocForm.get('requirement').markAsTouched();
    this.RelatedDocForm.get('DocType').markAsTouched();
    this.RelatedDocForm.get('comments').markAsTouched();
    this.RelatedDocForm.get('AsOfDate').markAsTouched();
         
   }
   public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

   selectEntityType(){
     
     var Req = this.requirements.filter((type: any) => {
      return type.entityType == this.RelatedDocForm.value.selectEntity;
    });
    this.FilteredReq = Req;

    if(this.RelatedDocForm.value.selectEntity == 'select'){
      this.FilteredReq = this.requirements;
     }
    this.RequirementChecked = false;
     this.RelatedDocForm.get('requirement').reset();
     this.RelatedDocForm.get('requirement').disable();
   }

   getRequirements(){
    this.requirementService.getRequirementList(this.currentDealiD).subscribe(reqList => {
      this.requirements = reqList.partyRequirement.concat(reqList.collateralRequirement,reqList.dealRequirement,reqList.loanRequirement,reqList.requirementRequirement);
      this.FilteredReq = reqList.partyRequirement.concat(reqList.collateralRequirement,reqList.dealRequirement,reqList.loanRequirement,reqList.requirementRequirement);
      this.requirements.forEach( (value:any)=> {
        if (value && value.type && value.name) {
          value.displayValue = value.type + ' - ' + value.name
      }
      });
      
    });
   }
   
  ngOnInit() {
    this.getRequirements();

    // if(this.RequirementChecked == false){
    //   this.RelatedDocForm.controls['requirement'].disable();
    // }
    // if(this.DocumentTypeChecked == false){
    //   this.RelatedDocForm.controls['DocType'].disable();
    // }
    // if(this.CommentsChecked == false){
    //   this.RelatedDocForm.controls['comments'].disable();
    // }
  }


 ApplyAll(){   
  var SelectedRequirement = this.RelatedDocForm.value.requirement;
  var SelectedDocType = this.RelatedDocForm.value.DocType;
    

    if (this.DocumentTypeChecked == true) {
        this.RelatedSelectedDocuments.forEach((doc) =>{
            if ((doc.relateChecked && doc.relateChecked == true)) {
                // $scope.createDocumentEditCopy(doc);
                if (SelectedDocType != undefined) {
                    //#already doc.editCopy.selectedDocType = $scope.selectedRelatedOutputDocType;
                    doc.documentDefinitionId = SelectedDocType.id;
                    doc.documentDefinitionName = SelectedDocType.name;
                    doc.selectedDocType = SelectedDocType.name;
                    doc.docDefinitionCode = null;
                }
                else {
                    //#already doc.editCopy.selectedDocType = null;
                    doc.editCopy.documentDefinitionId = 147;
                    doc.editCopy.documentDefinitionName = null;
                }
                doc.editDocumentRow = true;
                // angular.element("#table-" + doc.id).addClass("ng-dirty");
            }
        });
    }
    if (this.AsOfDateChecked == true) {
      this.RelatedSelectedDocuments.forEach((doc) =>{
            if ((doc.relateChecked && doc.relateChecked == true)) {
                console.log(this.SelectedAsofdate)
                doc.asOfDate = new Date(this.SelectedAsofdate);
                // if (!relatedChecked.docTypeChecked) {
                //     $scope.createDocumentEditCopy(doc);
                // }
                console.log(doc)
                doc.editDocumentRow = true;
                // angular.element("#table-" + doc.id).addClass("ng-dirty");
                // doc.editCopy.asOfDate = relatedEntity.asOfDate;
            }
        });
    }
    if (this.CommentsChecked == true) {
      this.RelatedSelectedDocuments.forEach((doc) =>{
            if ((doc.relateChecked && doc.relateChecked == true)) {
                doc.notes = this.SelectedComment;
                // if (!relatedChecked.asOfDate && !relatedChecked.docTypeChecked) {
                //     $scope.createDocumentEditCopy(doc);

                // }
                doc.editDocumentRow = true;
            
                // doc.editCopy.notes = relatedEntity.notes;
                // angular.element("#table-" + doc.id).addClass("ng-dirty");
            }
        });
    }
    if (this.RequirementChecked == true) {
      this.RelatedSelectedDocuments.forEach((doc) =>{
            if ((doc.relateChecked && doc.relateChecked == true)) {
                //#already $scope.isdocumentLoading = true;
                // if (!relatedChecked.asOfDate && !relatedChecked.docTypeChecked && !relatedChecked.commentChecked) {
                //     $scope.createDocumentEditCopy(doc, true);
                // }
                doc.editDocumentRow = true;
                // if ( SelectedRequirement) {
                //     this.RelatedSelectedDocuments = SelectedRequirement.requirementId;
                // }
                //#already var documentRequirement = {};
                if (doc && SelectedRequirement) {
                    if (!doc.attachedRequirements) {
                        doc.attachedRequirements = [];
                    }
                    var reqExist = doc.attachedRequirements.filter((docReq) =>{
                        return docReq.requirementId == SelectedRequirement.requirementId;
                    });
                    if (reqExist && reqExist.length == 0) {                      
                        //#already doc.editCopy.attachedRequirements.push(relatedEntity.selectedReqOutputDoc);
                      
                        if (doc.attachedRequirements.length == 0 && this.DocumentTypeChecked == false && SelectedRequirement.documentDefinitionId) {
                            
                          // if (!doc.editCopy || angular.equals({}, doc.editCopy)) {
                            //     doc.editCopy = {};
                            //     doc.editCopy = angular.copy(doc);
                            // }
                            //#already get current document type as selected type ahead.
                            var selectedDocType = this.docTypes.filter((docType) =>{
                                return docType.id == SelectedRequirement.documentDefinitionId;
                            })[0];


                            //#already get current document defination id and name type as selected type ahead.
                            doc.documentDefinitionId = selectedDocType.id;
                            doc.documentDefinitionName = selectedDocType.name;
                            doc.primary = true;
                            
                        }
                        doc.attachedRequirements.push(SelectedRequirement);
                       

                        // angular.element("#table-" + doc.id).addClass("ng-dirty");
                    }
                }
            }
        });
    }
    // #already if (relatedChecked.recievedDate) {
    //    $scope.dealDocuments.forEach(function (doc) {
    //        if ((doc.relateChecked && doc.relateChecked == true)) {

    //            if (!relatedChecked.asOfDate && !relatedChecked.docTypeChecked && !relatedChecked.commentChecked && !relatedChecked.reqChecked) {
    //                $scope.createDocumentEditCopy(doc);

    //            }
    //            doc.editDocumentRow = true;
    //            doc.editCopy.recievedDate = relatedEntity.recievedDate;
    //            angular.element("#table-" + doc.id).addClass("ng-dirty");
    //        }
    //    });
    //}
    this.RelatedSelectedDocuments.forEach((doc) =>{
        if (doc.relateChecked == true) {
            doc.isTableDirty = true;
        }
        doc.relateChecked = false;
    });
     this.activeModal.close();
 }

 public checkRequirement() {
  //  this.RequirementChecked = !this.RequirementChecked
  
  if(!this.isDocTypeValid()){
    this.serachType = '';
  }
   if(this.RequirementChecked === true) {
     this.RelatedDocForm.get('requirement').enable()
   }
   else {
     this.RelatedDocForm.get('requirement').reset()
     this.RelatedDocForm.get('requirement').disable()
   }
 }

  public checkDocType() {
    if(!this.isRequirementValid()){
      this.serachRequirement = '';
    }
    //this.serachRequirement = '';
    // this.DocumentTypeChecked = !this.DocumentTypeChecked
    if (this.DocumentTypeChecked === true) {
      this.RelatedDocForm.get('DocType').enable()
    }
    else {
      this.RelatedDocForm.get('DocType').reset()
      this.RelatedDocForm.get('DocType').disable()
    }
  }

  public checkAsOfDate() {
    if(!this.isRequirementValid()){
      this.serachRequirement = '';
    }
    if(!this.isDocTypeValid()){
      this.serachType = '';
    }

    // this.AsOfDateChecked = !this.AsOfDateChecked
    if (this.AsOfDateChecked === true) {
      this.RelatedDocForm.get('AsOfDate').enable()
    }
    else {
      this.RelatedDocForm.get('AsOfDate').reset()
      this.RelatedDocForm.get('AsOfDate').disable()
    }
  }
  public checkComments() {
    if(!this.isRequirementValid()){
      this.serachRequirement = '';
    }
    if(!this.isDocTypeValid()){
      this.serachType = '';
    }
    // this.CommentsChecked = !this.CommentsChecked
    if (this.CommentsChecked === true) {
      this.RelatedDocForm.get('comments').enable()
    }
    else {
      this.RelatedDocForm.get('comments').reset()
      this.RelatedDocForm.get('comments').disable()
    }
  }

  public displayFnRequirement(requirement): string {
    if (!requirement) return '';
    if (this.requirements) {
      if (this.requirements.length > 0) {
        let index = this.requirements.findIndex(req => req.id === requirement.id );
        return this.requirements[index].description + ' ' + this.requirements[index].name;
      }
    }
  }

  public displayFnDocumentType(docType): string {
    if (!docType) return '';
    if (this.docTypes) {
      if (this.docTypes.length > 0) {
        let index = this.docTypes.findIndex(doc => doc.name === docType.name);
        return this.docTypes[index].name;
      }
    }
  }

 clearForm(){
  // this.RelatedDocForm.reset();
  this.RelatedDocForm.get('requirement').reset();
  this.RelatedDocForm.get('DocType').reset();
  this.RelatedDocForm.get('AsOfDate').reset();
  this.RelatedDocForm.get('comments').reset();



  this.getRequirements();

    this.RequirementChecked = false;
    this.checkRequirement();

    this.DocumentTypeChecked = false
    this.checkDocType();

    this.AsOfDateChecked = false
    this.checkAsOfDate();

    this.CommentsChecked = false
    this.checkComments();
      

  }

  public isDocTypeValid() {
    let doc = this.RelatedDocForm.get('DocType').value
    if(this.DocumentTypeChecked) {
      if (doc) {
        if (doc.id) {
          let found = this.docTypes.find(docs => docs.id == doc.id)
          if (found) {
            return true
          }
        }
      }
      return false
    }
    return true
  }

  public isRequirementValid() {
    let req = this.RelatedDocForm.get('requirement').value
    if(this.RequirementChecked) {
      if (req) {
        if (req.id) {
          let found = this.FilteredReq.find(reqs => reqs.id == req.id)
          if (found) {
            return true
          }
        }
      }
      return false
    }
    return true
  }

  toFormattedDate(iso: string) {
    const date = new Date(iso);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  checkDatePattern() {
    let valid = /^(\d{1,2})[./-]\d{1,2}[./-](\d{4})$/.test(this.SelectedAsofdate)
    // console.log(regex.test(this.SelectedAsofdate))
    // console.log(valid)
    // console.log(this.RelatedDocForm.get('AsOfDate').errors)
    if(valid) {
      let momentDate = moment(this.SelectedAsofdate, 'MM/DD/YYYY')
      if(momentDate.isValid()) {
        let date = new Date(this.SelectedAsofdate.toString())
        this.SelectedAsofdate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
      }
      else {
        this.SelectedAsofdate = ''
      }
      // console.log(date)
    }
  }

}
