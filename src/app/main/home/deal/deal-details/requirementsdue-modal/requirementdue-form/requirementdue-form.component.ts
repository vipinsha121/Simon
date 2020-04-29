import { Component, OnInit, Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordion, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DealDto, DealServiceProxy, ReportServiceProxy, RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { AnyTxtRecord } from 'dns';

@Component({
    selector: 'requirementdue-form',
    templateUrl: './requirementdue-form.component.html',
    styleUrls: ['./requirementdue-form.component.css']
})

export class RequirementsDueFormComponent implements OnInit {
    @Input() reqdue: any
    ngOnInit() { }
}