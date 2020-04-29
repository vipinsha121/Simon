import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from './loader.service';


@Injectable({
    providedIn: 'root'
  })


  export class LoaderInterceptor implements HttpInterceptor {
    successMessage: any;
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.includes('GetMessagesForUser') || 
	       req.url.includes('GetAlertsForUser') || 
	       req.url.includes('GetUserUnReadMessagesCount'))
	        {
		        this.loaderService.hide();
	        }
            else {
                this.loaderService.show();
            }
            return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
