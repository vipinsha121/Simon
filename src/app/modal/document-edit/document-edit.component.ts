import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';
import * as _moment from 'moment';
import { DocumentDto,CodeServiceProxy, DocumentServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';
const moment = _moment;


@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentEditComponent implements OnInit {
  @Input() currentDocument: any;
  @Input() requirement: any;
  files: any = [];
  docDefinitionList : any = [];
  currentUser : any = [];
  isDocumentUpdated : any = [];
  updatedDocId : any = [];
  showUploadDocumentStatus : any = [];
  progressVisible : boolean = false;
  checked : any = [];
  currentDealData : Deal;
  baseUrl : string;
  DocumentAddForm: FormGroup;
  originalDocument : any;
  asOfDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]), [Validators.required, CustomValidatorsComponent.isDateValid]);
    recievedDate = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]), CustomValidatorsComponent.isDateValid);
    docTypeId: any;
  editMode: boolean;
  DocCtrl: FormControl;
  filteredDocs: Observable<any[]>;

  constructor(private store: Store<AppState>,
    public activeModal: NgbActiveModal,
    private codeService: CodeServiceProxy,
    private documentService : DocumentServiceProxy,
    private eventEmitterService: EventEmitterService,
    private FormBuilder: FormBuilder) { 
       // Party Form For Individual 
       this.DocumentAddForm = this.FormBuilder.group({
        id : 0,
        documentDefinitionId : 0,
        documentDefinitionName: [''],
        name: [''],
        alternateName: ['', Validators.required],
        description: [''],
        primary : false,
        asOfDate: this.asOfDate,
        recievedDate: this.recievedDate,
      });

      this.DocumentAddForm.get('asOfDate').markAsTouched()
      this.DocumentAddForm.get('alternateName').markAsTouched()

  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
   this.originalDocument =  Object.assign({}, this.currentDocument);
   
    this.files;
      this.codeService.getDropdownData("AdmDocumentDefinition").subscribe(result => {
      this.docDefinitionList = result;
    });
     this.getUser();
    this.getDeal();
   
    this.DocCtrl = new FormControl();
    this.DocCtrl.markAsTouched()
    this.filteredDocs = this.DocCtrl.valueChanges
      .pipe(
        startWith(''),
        map(Doc => Doc ? this.filterDocs(Doc) : this.docDefinitionList.slice())
      );
  }

  filterDocs(name: string) {
    return this.docDefinitionList.filter(Doc =>
        Doc.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  getUser(){
    this.store.select(user => user.currentUser).subscribe(result => {
         this.currentUser = result;
        });
  }
  getDeal(){
       this.store.select(state => state.deal).subscribe(result1 => {
        this.currentDealData = result1.filter(x => x.active == true)[0];
       });
  }

  uploadFile(event) {   
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)     
    }  
  }
  updateTypeId(docTypeId){
    this.docTypeId = docTypeId;
  }
  SaveEditDocument(originalDocument){
      if(this.docTypeId){
       originalDocument.documentDefinitionId = this.docTypeId;
      } 
       var fileIds = [];
            var fd = new FormData();
            this.requirement.uploadValidationError = false;
            this.requirement.uploadValidationErrorPrimary = false;
            this.requirement.asOfDateValidationError = false;
            if (originalDocument == null && originalDocument.documentDefinitionId == null) {
                        this.requirement.uploadFileNotChosenError = true;
            } else if (originalDocument) {
                this.requirement.uploadFileNotChosenError = true;
            }
            var identifier = 0;
            var document;
            //for (var i in $scope.files) {
            document = originalDocument;
                document.lastModBy = this.currentUser.userId;
                document.lastModByDate = new Date();
                // strip off new file name extension if it exists and append the original file extension (users not allowed to change file type)
                     var originalExtention = document.name.split('.').pop();
                if (document.alternateName)           
                document.alternateName = document.alternateName.replace(/(.*)\.(.*?)$/, "$1");
                document.alternateName = document.alternateName + '.' + originalExtention;

                if (document.alternateName.indexOf(".") == 0) {
                    // this document is missing name, so reset it to the original file nm
                    document.alternateName = document.originalFileName + "." + originalExtention;
                }
            fd.append('file' + identifier, this.files[0]);
            fd.append("requirementid" + identifier, this.requirement.requirementId);
            fd.append("currentuserid" + identifier, this.currentUser.userId);
            if (document.id)
                fd.append("id" + identifier, document.id);
            if (document.description)
                fd.append("description" + identifier, document.description);
            if (document.recievedDate)
                fd.append("recievedDate" + identifier, moment(document.recievedDate).format('MM/DD/YY h:mm'));
            if (document.lastModBy)
                fd.append("lastModBy" + identifier, document.lastModBy);
            if (document.lastModByDate)
                fd.append("lastModByDate" + identifier, document.lastModByDate);
            if (document.alternateName)
                fd.append("alternateName" + identifier, document.alternateName);
            if (document.asOfDate)
                fd.append("asOfDate" + identifier, moment(document.asOfDate).format('MM/DD/YY h:mm'));
            if (document.expirationDate)
                fd.append("expirationDate" + identifier, moment(document.expirationDate).format('MM/DD/YY h:mm'));
            if (document.primary)
                fd.append("primary" + identifier, document.primary);
            if (document.active)
                fd.append("active" + identifier,'true');
            if (document.notifyRolesDocAttached)
                fd.append("notifyRolesDocAttached" + identifier, document.notifyRolesDocAttached);
            //If primary, use requirement's documentDefinitionId
            if (document.primary) {
                fd.append("documentDefinitionId" + identifier, this.requirement.documentDefinitionId);
                document.documentDefinitionId = this.requirement.documentDefinitionId;
            }
            else//Use selected one
            {
                if (!document.documentDefinitionId)
                    this.requirement.uploadValidationError = true;
                else {
                    fd.append("documentDefinitionId" + identifier, (document.documentDefinitionId));
                }
            }
            // set the dealID
            fd.append("dealId" + identifier, this.currentDealData.dealId);

            if ((!document.asOfDate) && this.requirement.requireAsOfDate == true && document.primary == true)
                this.requirement.asOfDateValidationError = true;
            else
                this.requirement.asOfDateValidationError = false;

            identifier++;
            //}
            if ((!this.requirement.uploadValidationError) && (!this.requirement.asOfDateValidationError)) {
                var self = this;
                var xhr = new XMLHttpRequest();
                 xhr.open("POST", this.baseUrl + "api/v1/document/UpdateDocumentDocList");
                 xhr.setRequestHeader("Authorization", "Bearer ");
                 xhr.send(fd);       
                 var fileId = null;   
                 this.progressVisible = true;
                 this.checked = false; 
                 this.showUploadDocumentStatus = true; 
                 this.activeModal.dismiss();
                  xhr.onreadystatechange = function() {
                   if(xhr.readyState == 4 && xhr.status == 200) {
                         self.eventEmitterService.UpdatePartyDocumentList();           
                         self.eventEmitterService.UpdateReqDocumentList();              
                  }
                 }
            }
    
  }
  cancelEditDocument(doc){
    this.activeModal.dismiss();
  }

//   public check() {
//       console.log(this.DocumentAddForm.get('asOfDate').value)
//     //   let date = moment(this.DocumentAddForm.get('asOfDate').value)
//     //   let year = date.isValid()

//     let date = new Date(this.DocumentAddForm.get('asOfDate').value)
//     let year = date.getFullYear()
//       console.log(year)
//   }
}
