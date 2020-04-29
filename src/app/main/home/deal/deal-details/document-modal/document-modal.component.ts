import { Component, OnInit, Input } from '@angular/core';
import { DocumentServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';

@Component({
  selector: 'document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentModalComponent implements OnInit {

  @Input() currentDeal: any;
  documents: Array<any> = [];
  documentscount: number;
  page: number = 1;
  pageSize: number = 10;

  constructor(private documentService: DocumentServiceProxy) { }

  ngOnInit() {
    this.documentService.getDocumentsForDeal(this.currentDeal.id).subscribe(documentList => {
      this.documents = documentList;
      this.documentscount = this.documents.length;
    });
  }

}
