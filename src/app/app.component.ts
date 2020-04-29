import { Component, OnInit } from '@angular/core';
import { AdalService } from 'ng2-adal/dist/services/adal.service';
import { SecretService } from 'src/app/authentication/secret.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'simon-angular';
  authenticated = false;
  modalRef: NgbModalRef;
  subscription: Subscription;
  browserRefresh: boolean = false;

  constructor(private adalService: AdalService,
    private secretService: SecretService,
    public confirmService: confirmModalPopupService,
    private router: Router) {
    this.adalService.init(this.secretService.adalConfig);

    // Redirect on parent route on page refresh
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
        if(this.browserRefresh && event.url.match(/\/main\/deal\/\w{5}\/(party|loan|collateral)\/(\w{5}|\w{4})/)) {
          let  baseRoute = event.url.match(/\/main\/deal\/\w{5}\/(party|loan|collateral)/);
          this.router.navigateByUrl(baseRoute[0]);
        }
      }
    });

  }


  ngOnInit(): void {
  }
}
