import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DealServiceProxy, DealUserNoteCustomModel } from 'src/app/shared/services/service-proxy/service-proxies';
import { Deal } from 'src/app/shared/models/deal.model';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UserDealNote } from './deal-note.model';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';

@Component({
    selector: 'toolbar-deal-notes',
    templateUrl: './deal-notes.component.html',
    styleUrls: ['./deal-notes.component.css']
})

export class DealNotesComponent implements OnInit {
    @Input() currentMenu: any = {};
    @ViewChild('note') editor:  ElementRef;
    date_time : Date;
    Adminname:string;
    currentDealData: Deal;
    currentUser: any;
    dealNoteData: any;
    dealId: number = 0;
    showDealUser: boolean ;
    hidden: false;
    public htmlContent;
    dialog_body;
    userDealNote = new DealUserNoteCustomModel();

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '150px',
        minHeight: '200px',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
          {class: 'arial', name: 'Arial'},
          {class: 'times-new-roman', name: 'Times New Roman'},
          {class: 'calibri', name: 'Calibri'},
          {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      sanitize: true,
      toolbarPosition: 'top',
  };
  
    constructor(private _dealService: DealServiceProxy,
      private localStorageService: LocalstorageService,
        private activedRoute: ActivatedRoute) { 
            this.htmlContent=" ";
            activedRoute.params.subscribe(params => {
                this.dealId = params["dealId"];
              });
        }
    ngOnInit() {
      this.dialog_body = true;    
      this.currentUser = this.localStorageService.get("currentUser");
    }

    saveDealNote(){
      this.userDealNote.createdBy = this.currentUser.userId;
      this.userDealNote.dealId =this.dealId;
      this.userDealNote.note = this.htmlContent;
      this.userDealNote.userId = this.currentUser.userId;   
      if(this.dealNoteData && this.dealNoteData.dealUserNoteId == null || this.dealNoteData.dealUserNoteId == undefined){ 
        this.userDealNote.dealUserNoteId == null;
      }
      else{
        this.userDealNote.dealUserNoteId = this.dealNoteData.dealUserNoteId;
      }
      this._dealService.postDealUserNote(this.userDealNote).subscribe(result => {
      });
      this.showDealUser = !this.showDealUser;
    }
    openDealNoteModal() {
       this.dialog_body = true; 
        this.showDealUser = !this.showDealUser;
        this._dealService.getDealUserNote(this.dealId, this.currentUser.userId).subscribe(result => {
        this.dealNoteData = result;
        if(this.dealNoteData==undefined){
          this.htmlContent = "";
          this.dealNoteData ="";
        }
        this.htmlContent = this.dealNoteData.note;

      })
      this.htmlContent = this.editor.nativeElement.html();
    }
}
