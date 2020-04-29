import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';


@Injectable({
    providedIn: 'root'
  })

  export class SpinnerInterceptor implements HttpInterceptor {
    constructor(public spinnerService: SpinnerService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.includes('GetMessagesForUser') || 
	       req.url.includes('GetAlertsForUser') || 
	       req.url.includes('GetUserUnReadMessagesCount'))
	    {
		    this.spinnerService.hide();
	    }
        else 
        {
            this.spinnerService.show();
        }
        return next.handle(req).pipe(
            finalize(() => this.spinnerService.hide())
        );
    }
}
