import { HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export interface ISiteApiResponse {
    error: boolean;
    valid: boolean;
    message: string;
    data: any;
}

export class SiteApiResponseUtilities {
    getErrors(resp: ISiteApiResponse) {
        if (!resp){ return []};
        
        let errors = [];

        if (resp.data && !resp.valid) {
            for (const propName of Object.getOwnPropertyNames(resp.data)) {
                const value = resp.data[propName];
                
                if (typeof value === "string") {
                    errors.push(value);
                }
                else if (value instanceof Array) {
                    errors.push(...value);
                }
            }
        }
        else if (resp.error) {
            errors.push(resp.message);
        }
    
        return errors;
    }

    onServiceError (resp: HttpErrorResponse): Observable<any> {
        let data = {};
    
        if (resp instanceof HttpErrorResponse) {
            data = resp.error ? resp.error : {};
        }
    
        return Observable.throw(data);
    }
}