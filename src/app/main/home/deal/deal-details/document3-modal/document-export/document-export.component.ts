import { Component, OnInit } from '@angular/core';
import { EcmDocumentManagerServiceProxy,CodeServiceProxy,DocumentServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-document-export',
  templateUrl: './document-export.component.html',
  styleUrls: ['./document-export.component.css']
})
export class DocumentExportComponent implements OnInit {
  showToolbarExport = true;
  synergyDocs : Array<any> = [];
  currentDeal : any;
  searchText: string;
  cabinets : Array<any> = [];
  currentDoc : any;
  subscription: Subscription;
  isSelectAll : boolean= false;

  constructor(private ecmDocService: EcmDocumentManagerServiceProxy,private store: Store<AppState>,
              private codeService : CodeServiceProxy,private docService :DocumentServiceProxy,
              private eventEmitterService: EventEmitterService) {
    this.store.select(state => state.selectedMenu).subscribe(result => this.currentDeal = result)
  }

  ngOnInit() {
    if (this.currentDeal) {
       this.ecmDocService.getDealEcmDocumentsList(this.currentDeal.id).subscribe(docList => {
         this.synergyDocs = docList;
         this.codeService.getDropdownData("ecmcabinetname").subscribe(cabinetList => {
          this.cabinets = cabinetList;
          this.getDocumentCabinetLists(this.synergyDocs);
        });
        this.synergyDocs.forEach((d : any) => {
          if(d.isExportReady){d.ecmStatus = 'Ready';}
          else{d.ecmStatus ='';}
        });
       });
    };

    this.subscription = this.eventEmitterService.getSynergyDoclist().subscribe(data => {
      if (data) {
        this.synergyDocs = data;
      }
    });
  }

  toggleToolbar() {
    this.showToolbarExport = !this.showToolbarExport;
  }

  getDocumentCabinetLists(docs : Array<any>){
   // var cabinets =this.cabinets;
    docs.forEach((d : any) => {
        if (d && d.cabinetCode) {
            if (this.cabinets && d) {
              d.cabinetList = this.cabinets;
              if (d.cabinetCode == "01") {
                // cif cabinet
                this.removeArrayElementById(d.cabinetList, "02"); // remove loans
            }
            if (d.cabinetCode == "02") {
                // loan cabinet
                this.removeArrayElementById(d.cabinetList, "01"); // remove cif
                this.removeArrayElementById(d.cabinetList, "03"); // remove employee
            }
          }
          d.selectedCabinet = {};
          d.selectedCabinet.id = d.cabinetCode;
        }
  });

  }

  removeArrayElementById(array, element) {
    var index = array.map(e => { return e.id; }).indexOf(element);
            if (index !== -1) {
                array.splice(index, 1);
            }
   }

   exportSelectedDocuments(docList : Array<any>,i:number){
    this.currentDoc = {};
    docList.forEach((doc: any) => {
        this.currentDoc.id = doc.id;
        this.currentDoc.EcmExportReady = doc.isPendingExportReady;
        this.currentDoc.EcmCabinetCode = doc.cabinetCode;
        if (this.currentDoc && this.currentDoc.EcmExportReady){
        this.docService.updateDocumentExportFlag(this.currentDoc).subscribe(data => {
          if (this.currentDoc && this.currentDoc.EcmExportReady == true)
          doc.isExportReady = true;
        });
      }
    });
    this.isSelectAll = false;
  }

  onChange(event){
    if(event.checked == true){
    this.synergyDocs.forEach((doc:any)=>{
      doc.isPendingExportReady = true;

    });
   }
  else{
    this.synergyDocs.forEach((doc:any)=>{
      doc.isPendingExportReady = false;

    });
   }
  }


}
