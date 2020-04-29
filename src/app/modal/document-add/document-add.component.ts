import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppState } from 'src/app/shared/models/app.state';
import * as _moment from 'moment';
import { DocumentDto, CodeServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomValidatorsComponent } from 'src/app/shared/validators/custom-validators/custom-validators.component';
const moment = _moment;

export interface DocDefinitionList {
    id: any;
    name: any;
    notifyRolesDocAttached: any;
    type: any;
}

@Component({
    selector: 'app-document-add',
    templateUrl: './document-add.component.html',
    styleUrls: ['./document-add.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class DocumentAddComponent implements OnInit {
    @Input() requirement: any;
    files: any = [];
    currentUser: any = [];
    isDocumentUpdated: any = [];
    updatedDocId: any = [];
    showUploadDocumentStatus: any = [];
    progressVisible: boolean = false;
    checked: any = [];
    docDefinitionList: any = [];
    currentDealData: Deal;
    DocumentAddForm: FormGroup;
    date = new FormControl(moment("12-25-1995", ["MM-DD-YYYY", "YYYY-MM-DD"]));
    editMode: boolean;
    NewDocument: DocumentDto = new DocumentDto();
    DocCtrl: FormControl;
    filteredDocs: Observable<any[]>;
    baseUrl : string;
    DocTypeName: any;


    constructor(private store: Store<AppState>,
        public activeModal: NgbActiveModal,
        private codeService: CodeServiceProxy,
        private FormBuilder: FormBuilder) {
        // Party Form For Individual 
        this.DocumentAddForm = this.FormBuilder.group({
            id: 0,
            documentDefinitionId: 0,
            documentDefinitionName: [''],
            name: [''],
            alternateName: ['', Validators.required],
            description: [''],
            primary: false,
            asOfDate: [this.date, [Validators.required, CustomValidatorsComponent.isDateValid]],
            recievedDate: [this.date, CustomValidatorsComponent.isDateValid]
        });

        this.DocumentAddForm.get('asOfDate').markAsTouched()
        this.DocumentAddForm.get('alternateName').markAsTouched()
    }

    ngOnInit() {
        this.baseUrl = environment.baseUrl;
        this.codeService.getDropdownData("AdmDocumentDefinition").subscribe((result: any) => {
            this.docDefinitionList = result;
          
            var selectedDocType = this.docDefinitionList.filter((docType) =>{
              return docType.id == this.requirement.documentDefinitionId;
          })[0];
          this.DocTypeName = selectedDocType.name;
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

    uploadFile(event) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element)
            this.NewDocument.alternateName = this.files[0].name;
        }
    }
    getUser() {
        this.store.select(user => user.currentUser).subscribe(result => {
            this.currentUser = result;
        });
    }
    getDeal() {
        this.store.select(state => state.deal).subscribe(result1 => {
            this.currentDealData = result1.filter(x => x.active == true)[0];
        });
    }

    SaveDocument(NewDocument) {
        var fileIds = [];
        var fd = new FormData();
        this.requirement.uploadValidationError = false;
        this.requirement.uploadValidationErrorPrimary = false;
        this.requirement.asOfDateValidationError = false;
        if (this.NewDocument == null && this.NewDocument.documentDefinitionId == null) {
            this.requirement.uploadFileNotChosenError = true;
        } else if (this.NewDocument) {
            this.requirement.uploadFileNotChosenError = true;
        }
        var identifier = 0;
        var document;
        //for (var i in $scope.files) {
        document = this.NewDocument;
        var originalExtention = this.files[0].name.split('.').pop();
        document.alternateName = document.alternateName.replace(/(.*)\.(.*?)$/, "$1");
        if (document.alternateName == "") {
            document.alternateName = this.files[0].name;
        }
        else {
            document.alternateName = document.alternateName + '.' + originalExtention;
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
        if (document.asOfDate)
            fd.append("asOfDate" + identifier, moment(document.asOfDate).format('MM/DD/YY h:mm'));
        if (document.expirationDate)
            fd.append("expirationDate" + identifier, moment(document.expirationDate).format('MM/DD/YY h:mm'));
        if (document.alternateName)
            fd.append("alternateName" + identifier, document.alternateName);
        if (document.primary)
            fd.append("primary" + identifier, document.primary);
        if (document.active)
            fd.append("active" + identifier, 'true');
        if (document.notifyRolesDocAttached)
            fd.append("notifyRolesDocAttached" + identifier, document.notifyRolesDocAttached);
        //If primary, use requirement's documentDefinitionId
        if (document.primary) {
            fd.append("documentDefinitionId" + identifier, this.requirement.documentDefinitionId);
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
            var xhr = new XMLHttpRequest();
            var fileId = null;
            xhr.open("POST", this.baseUrl + "api/v1/document/UploadRequirementDocument");
            xhr.setRequestHeader("Authorization", "Bearer ");
            this.progressVisible = true;
            xhr.send(fd);
            this.checked = false; // hide the sidebar
            this.showUploadDocumentStatus = true; // initiate the progress spinner in the requirements document list

        }

    }

}
