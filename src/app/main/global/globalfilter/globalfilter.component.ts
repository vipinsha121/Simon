import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';
import { AppConsts } from 'src/app/shared/app-constants';
import { UserServiceProxy, MessagingServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { pageFilter } from 'src/app/shared/models/pagefilter.model';
@Component({
    selector: 'app-globalFilter',
    templateUrl: './globalfilter.component.html',
    styleUrls: ['./globalfilter.component.css']
})

export class GlobalFilterComponent implements OnInit {
    ngOnInit() { }
}