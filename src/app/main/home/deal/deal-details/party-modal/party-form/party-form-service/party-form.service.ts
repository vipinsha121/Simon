import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartyFormService {
  percentDone: number;
  uploadSuccess: boolean;
  baseUrl : string;


  constructor(private HttpClient: HttpClient) { 
    this.baseUrl = environment.baseUrl;
  }

  postUploadedFiles(fd): Observable<any> {
  //   var fd = new FormData();
  //   files.forEach(function (file, index) {
  //     fd.append('file' + index, file);
  // })

  // fd.append("dealId", currentDeal);

    return this.HttpClient.post(this.baseUrl + `api/v1/document/UploadDocument`, fd, {reportProgress: true, observe: 'events'})
    .pipe( map((body: any) => {
           return body;
          }),
         catchError(this.handleError)
       );
  }
  // PutPartyForm(party){
  //   return this.HttpClient.put(`http://localhost:58386/api/Party`, party)
  //  .pipe(
  //    map((body: any) => body),
  //    catchError(this.handleError)
  //  );
  // }

  // PutPartyForm(party) {
  //   return this.HttpClient.put(`http://localhost:58386/api/Party`, party)
  //    .toPromise()
  //   .then(res => res)
  // }

  // getPartyForm(): Observable<any> {
  //   return this.HttpClient.get(`http://localhost:58386/api/v1/party/GetPartyDetails/15508/20677`)
  //     .pipe(
  //       map((body: any) => body),
  //       catchError(this.handleError)
  //     );
  // }

  private handleError(error: HttpErrorResponse) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return throwError(errMessage);

    }
    return throwError(error || 'Node.js server error');
  }
}
