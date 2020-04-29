import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { pipe, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PartyFormService } from './../../main/home/deal/deal-details/party-modal/party-form/party-form-service/party-form.service'; 
import { DocumentServiceProxy } from './../../shared/services/service-proxy/service-proxies' 
import { LoaderService } from './../../shared/loader/loader.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderInterceptor } from './../../shared/loader/loader.interceptor'

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.css']
})
export class DocumentsUploadComponent implements OnInit {
  @Input() currentDeal: any;
  @Input() uploadedPercentage = 0;
  percentDone: number;
  uploadSuccess: boolean;
  progress: any;
  files: any = [];
  UploadingMessage: any;
  successMessage: any;
  FIleArray = new FormData();
  disableButton: boolean;


  constructor(private HttpClient: HttpClient,
    private PartyFormService: PartyFormService,
    private DocumentServiceProxy: DocumentServiceProxy,
    private LoaderService: LoaderService,
    public activeModal: NgbActiveModal,
    private LoaderInterceptor: LoaderInterceptor) { }

  ngOnInit() {
  }

  uploadFile(event) {
    
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element)
    }  
  }

  removeDocument(event){
    // event = null;
    this.files.splice(event, 1);
  }

  postUploadedFiles(){
    this.disableButton = true;
    var fd = new FormData();
    this.files.forEach(function (file, index) {
      fd.append('file' + index, file);
    })
    this.FIleArray = fd;
    fd.append("dealId", this.currentDeal.id);


    this.PartyFormService.postUploadedFiles(fd). subscribe((event: HttpEvent<any>) =>{
      // this.UploadingMessage = "Files are Uploading";
      if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)){
        this.uploadedPercentage = event['loaded'] / event['total'] * 100;
      }
      if(this.uploadedPercentage == 100){
        // this.successMessage = "Files Uploaded Successfully";
        // this.files.splice(event.type);
      }
      // this.activeModal.dismiss();
      // this.disableButton = false;
      catchError(this.handleError)
    })

  }
    private handleError(error: HttpErrorResponse) {
    // console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return throwError(errMessage);

    }
    return throwError(error || 'Node.js server error');
  }

}
