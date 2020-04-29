import { Observable, Observer, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SimonSharedService {
    baseData: any;
    dataChange: Observable<any>;
    dataChangeObserver: Observer<any>;

    private clearSearchSource = new Subject<any>();
    public clearSearch$ = this.clearSearchSource.asObservable();
  
    constructor() {
        this.dataChange = new Observable((observer: Observer<any>) => {
            this.dataChangeObserver = observer;
        });
    }

    setData(data: any) {
        this.baseData = data;
        this.dataChangeObserver.next(this.baseData);
    }
    
   //Clear search Box
    clearSearch(data:any) {
      this.clearSearchSource.next(data);
    }
}