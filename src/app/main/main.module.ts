import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {BrowserModule} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from '../main/main-routing.module';
import { InboxComponent } from './home/inbox/inbox.component';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './home/toolbar/toolbar.component';
import { DealComponent } from './home/deal/deal.component';
import { MessageComponent } from './message/message.component';
import { DealMessageComponent } from '../main/home/toolbar/deal-message/deal-message.component';
import { AsideComponent } from '../shared/layout/nav/aside/aside.component';
import { inboxSectionComponent } from '../shared/layout/nav/aside/inbox-section/inbox-section.component';
import { DealSectionComponent } from '../shared/layout/nav/aside/deal-section/deal-section.component';
import { SimonGridComponent } from '../shared/common/simon-grid/simon-grid.component';
import { simonPaginationComponent } from '../shared/simon-pagination/simon-pagination.component';
import { NgbPaginationModule, NgbAlertModule, NgbAccordionModule, NgbTooltipModule, NgbTabsetModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DealStagesComponent } from './home/toolbar/deal-stages/deal-stages.component';
import { ParticipantsComponent } from './home/toolbar/participants/participants.component';
import { DealNotesComponent } from './home/toolbar/deal-notes/deal-notes.component';
import { QuickviewComponent } from './home/toolbar/quickview/quickview.component';
import { DealHeaderComponent } from './home/deal/deal-header/deal-header.component';
import { PartyModalComponent } from './home/deal/deal-details/party-modal/party-modal.component';
import { CollateralModalComponent } from './home/deal/deal-details/collateral-modal/collateral-modal.component';
import { LoanModalComponent } from './home/deal/deal-details/loan-modal/loan-modal.component';
import { SummaryModalComponent } from './home/deal/deal-details/summary-modal/summary-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { ReportsComponent } from './home/toolbar/reports/reports.component';
import { AssignDealComponent } from './home/toolbar/assign-deal/assign-deal.component';
import { CollateralFormComponent } from './home/deal/deal-details/collateral-modal/collateral-form/collateral-form.component';
import { LoanFormComponent } from './home/deal/deal-details/loan-modal/loan-form/loan-form.component';
import { PartyFormComponent, PrimaryDiaglog } from './home/deal/deal-details/party-modal/party-form/party-form.component';
import { RequirementModalComponent } from './home/deal/deal-details/requirement-modal/requirement-modal.component';
import { DocumentModalComponent } from './home/deal/deal-details/document-modal/document-modal.component';
import { DealDatesComponent } from './home/deal/deal-details/deal-dates/deal-dates-modal.component';
import { LoanAdminComponent } from './home/toolbar/loanadmin/loanadmin.component';
import { RequirementFormComponent } from './home/deal/deal-details/requirement-modal/requirement-form/requirement-form.component';
import { EventModalComponent } from './home/deal/deal-details/events-modal/events-modal.component';
import { ProcessesModalComponent } from './home/deal/deal-details/Processes-modal/processes-modal.component';
import { RecentCollateralDocsComponent } from './home/deal/deal-details/collateral-modal/recent-colldocuments-modal/recent-colldocuments.component';
import { CollateralGoogleMapComponent } from './home/deal/deal-details/collateral-modal/collateral-googlemap/collateral-googlemap.component';
import { MaterialModule } from '../material/material.module';
import { GlobalComponent } from './global/global.component';
import { GlobalFilterComponent } from './global/globalfilter/globalfilter.component';
import { GlobalGridListComponent } from './global/globalgridlist/globalgridlist.component';
import { HeaderComponent } from '../shared/layout/nav/header/header.component';
import { RabbitMQMessagesComponent } from '../messages/rabbitmqmessages.component';
import { MainService } from './main.service';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { SummaryDetailComponent } from './home/deal/deal-details/summary-modal/summary-detail/summary-detail.component';
import { Requirement2ModalComponent } from './home/deal/deal-details/requirement2-modal/requirement2-modal.component';
import { jqxLoaderComponent, jqxLoaderModule } from 'jqwidgets-ng/jqxloader';
import { ReqFormComponent } from '../shared/forms/req-form/req-form.component';
import { RequirementSideformComponent } from './home/deal/deal-details/requirement2-modal/requirement-sideform/requirement-sideform.component';
import { PartySummaryComponent } from './home/deal/deal-details/summary-modal/party-summary/party-summary.component';
import { RequirementsListComponent } from '../shared/requirements-list/requirements-list.component';
import { DocumentsListComponent } from '../shared/documents-list/documents-list.component';
import { RequirementDetailsComponent } from '../shared/requirements-list/requirement-details/requirement-details.component';
import { DocumentDetailsComponent } from '../shared/documents-list/document-details/document-details.component';
import { jqxTooltipModule } from 'jqwidgets-ng/jqxtooltip';
//import { jqxButtonModule } from 'jqwidgets-ng/jqxbutton';
import { jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { jqxInputModule } from 'jqwidgets-ng/jqxinput';
import { jqxNumberInputModule } from 'jqwidgets-ng/jqxnumberinput';
import { jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { PartyEditComponent } from './home/deal/deal-details/party-modal/party-edit/party-edit.component';
import { RequirementActionMenuComponent } from '../shared/common/requirement-action/action-menu/requirement-action-menu.component';
import { RequirementActionSelectComponent } from '../shared/common/requirement-action/action-select/requirement-action-select.component';
import { RequirementActionComponent } from '../shared/common/requirement-action/requirement-action.component';
import { Document3ModalComponent } from './home/deal/deal-details/document3-modal/document3-modal.component';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { MessageThreadComponent } from './../shared/messages/message-thread.component';
import { MessagesComponent } from '../shared/messages/messages/messages.component';
import { SelectModule } from 'ng2-select';
import { jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { SearchDocuments } from './home/deal/deal-details/document3-modal/filter-Docs.pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { SearchActiveDocuments } from './home/deal/deal-details/document3-modal/filter-activedocuments.pipe';
import { FilterReqbyStage } from './home/deal/deal-details/requirement2-modal/reqstageFilter.pipe';
import { ExternalParticipantsComponent } from './home/toolbar/external-participants/external-participants.component';
import { DocumentExportComponent } from './home/deal/deal-details/document3-modal/document-export/document-export.component';
import { DocumentExportedComponent } from './home/deal/deal-details/document3-modal/document-exported/document-exported.component';
import { ProcessModalComponent } from './home/deal/deal-details/process-modal/process-modal.component';
import { TicklerModalComponent } from './home/deal/deal-details/tickler-modal/tickler-modal.component';
import { LoanSummaryComponent } from './home/deal/deal-details/summary-modal/loan-summary/loan-summary.component';
import { CollateralSummaryComponent } from './home/deal/deal-details/summary-modal/collateral-summary/collateral-summary.component';
import { NumberDirective } from '../shared/directives/numberInputValidation/numbers-only.directive';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from './spinner/spinner.service';
import { SpinnerInterceptor } from './spinner/spinner.interceptor';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ScrollToBottomDirective } from '../shared/directives/scroll-to-bottom.directive';
import { OrderByPipe } from '../shared/pipe/orderBy.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DealOfficerComponent } from './home/toolbar/deal-officer/deal-officer.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog'
import { AngularEditorModule } from '@kolkov/angular-editor';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MessageDialogComponent } from '../shared/dialogs/message-dialog/dialog.component';
import { MessageDialogService } from '../shared/dialogs/message-dialog/message-dialog.service';
import { ExternalParticipant } from './home/toolbar/external-participant/external-participant.component';
import { ReqSearchPipe } from '../shared/pipe/req-search.pipe';
import { ToolbarHistoryComponent } from "./home/toolbar/history/history.component";
import { HistoryCommonComponent } from '../shared/common/history/history.component';
import { SimonSharedService } from '../shared/services/SimonGlobalService';
import { Requirement2SearchPipe } from './home/deal/deal-details/requirement2-modal/req-search.pipe';
import { DetailsComponent } from "../shared/requirements-list/requirement-details/details/details.component";
import { RequirementDocsComponent } from "../shared/requirements-list/requirement-details/requirement-docs/requirement-docs.component";
import { HistoryComponent } from "../shared/requirements-list/requirement-details/history/history.component";
import { PartyDetailsComponent } from './home/deal/deal-details/party-modal/party-details/party-details.component';
import { PartyRelatedDealsComponent } from './home/deal/deal-details/party-modal/party-related-deals/party-related-deals.component';

@NgModule({
  declarations: [
    InboxComponent,
    HomeComponent,
    ToolbarComponent,
    DealComponent,
    MessageComponent,
    DealMessageComponent,
    AsideComponent,
    inboxSectionComponent,
    DealSectionComponent,
    SimonGridComponent,
    simonPaginationComponent,
    DealStagesComponent,
    ParticipantsComponent,
    ExternalParticipantsComponent,
    DealNotesComponent,
    QuickviewComponent,
    DealHeaderComponent,
    HeaderComponent,
    PartyModalComponent,
    CollateralModalComponent,
    LoanModalComponent,
    SummaryModalComponent,
    MainComponent,
    ReportsComponent,
    AssignDealComponent,
    CollateralFormComponent,
    LoanFormComponent,
    PartyFormComponent,
    RequirementModalComponent,
    DocumentModalComponent,
    DealDatesComponent,
    RequirementFormComponent,
    EventModalComponent,
    ProcessesModalComponent,
    MessageThreadComponent,
    RecentCollateralDocsComponent,
    CollateralGoogleMapComponent,
    GlobalComponent,
    GlobalFilterComponent,
    GlobalGridListComponent,
    RabbitMQMessagesComponent,
    SummaryDetailComponent,
    Requirement2ModalComponent,
    ReqFormComponent,
    RequirementSideformComponent,
    PartySummaryComponent,
    RequirementsListComponent,
    RequirementDetailsComponent,
    DocumentsListComponent,
    DocumentDetailsComponent,
    PartyEditComponent,
    RequirementActionMenuComponent,
    RequirementActionSelectComponent,
    Document3ModalComponent,
    MessagesComponent,
    SearchDocuments,
    SearchActiveDocuments,
    FilterReqbyStage,
    ProcessModalComponent,
    TicklerModalComponent,
    LoanSummaryComponent,
    CollateralSummaryComponent,
    DocumentExportComponent,
    DocumentExportedComponent,
    NumberDirective,
    SpinnerComponent,
    NumberDirective,
    LoaderComponent,
    PrimaryDiaglog,
    ScrollToBottomDirective,
    OrderByPipe,
    DealOfficerComponent,
    MessageDialogComponent,
    ExternalParticipant,
    ToolbarHistoryComponent,
    HistoryCommonComponent,
    ReqSearchPipe,
    Requirement2SearchPipe,
    DetailsComponent,
    RequirementDocsComponent,
    HistoryComponent,
    PartyDetailsComponent,
    PartyRelatedDealsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MainRoutingModule,
    NgbPaginationModule,
    NgbAlertModule,
    FormsModule, ReactiveFormsModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbTabsetModule,
    NgbDatepickerModule,
    MaterialModule,
    jqxGridModule,
    jqxTooltipModule,
    //jqxButtonModule,
    jqxMenuModule,
    jqxInputModule,
    jqxNumberInputModule,
    jqxWindowModule,
    jqxLoaderModule,
    jqxDropDownListModule,
    SelectModule,
    jqxComboBoxModule,
    BrowserAnimationsModule,
    TextMaskModule,
    Ng2SearchPipeModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    AngularEditorModule,
    MatPaginatorModule
  ],
  exports: [
    SearchDocuments,
    RequirementDetailsComponent,
    RequirementsListComponent,
    MessageDialogComponent,
    LoaderComponent,
    OrderByPipe,
    HistoryCommonComponent,
    NgxMatSelectSearchModule,
    Requirement2SearchPipe
  ],
  entryComponents: [
    RequirementDetailsComponent,
    RequirementsListComponent,
    PrimaryDiaglog
  ],
    providers: [MainService, RequirementActionComponent, MessageDialogService, SimonSharedService, SpinnerService,  { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }]
})
export class MainModule { }
