import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcmDocumentManagerServiceProxy,DocumentServiceProxy} from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';

@Component({
  selector: 'app-document-exported',
  templateUrl: './document-exported.component.html',
  styleUrls: ['./document-exported.component.css']
})
export class DocumentExportedComponent implements OnInit {
  showToolbarExported = true;
  synergyDocs : Array<any> = [];
  currentDeal : any;
  currentDoc : any;
  searchText: string;
  dealId : number;

  constructor(public ecmDocService: EcmDocumentManagerServiceProxy,private store: Store<AppState>,
    private docService : DocumentServiceProxy,private eventEmitterService :EventEmitterService,private activatedRoute: ActivatedRoute) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.dealId = params["dealId"];
      });
    this.store.select(state => state.selectedMenu).subscribe(result => this.currentDeal = result)
  }


  ngOnInit() {
    if (this.currentDeal) {
       this.ecmDocService.getDealEcmExportedDocumentsList(this.currentDeal.id).subscribe(docList => {
         this.synergyDocs = docList;
       });
    };
  }

  onChange(event){
    if(event.checked == true){
    this.synergyDocs.forEach((doc:any)=>{
      doc.isResetExportReady = true;

    });
  }
  else{
    this.synergyDocs.forEach((doc:any)=>{
      doc.isResetExportReady = false;

    });
  }

  }

  resetSelectedDocuments(docList : Array<any>,i:number){
    docList.forEach((doc: any) => {
      this.currentDoc = {};
      this.currentDoc.id = doc.id;
      if (doc.isResetExportReady) {
        this.currentDoc.EcmExportReady = false;  // reset the export flag
        this.currentDoc.EcmExported = false;
      }
        if (this.currentDoc && this.currentDoc.EcmExportReady == false){
        this.docService.updateDocumentExportFlag(this.currentDoc).subscribe(data => {
          this.ecmDocService.getDealEcmExportedDocumentsList(this.currentDeal.id).subscribe(docList => {
            this.synergyDocs = docList;
            this.eventEmitterService.setSynergyDoclist(this.dealId);
          });
        });
      }
    });
  }

  toggleToolbar() {
    this.showToolbarExported = !this.showToolbarExported;
  }
}
