import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ExternalService {
  private dataSource = new Subject<any>();
  public companydata$ = this.dataSource.asObservable();

  setCompanyData(data: any) {
    this.dataSource.next(data);
  }
}
