
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import 'hammerjs';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { ServiceProxyModule } from './shared/services/service-proxy/service-proxy.module';
import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
import { inboxReducer } from 'src/app/shared/store/reducers/inbox/inbox.reducer';
import { LocalstorageService } from 'src/app/shared/services/local-storage/localstorage.service';
import { localStorageSync } from 'ngrx-store-localstorage';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { SimonStompConfig } from './shared/config/rx-stomp.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdalService } from 'ng2-adal/dist/core';
import { SecretService } from 'src/app/authentication/secret.service';
import { LoggedInGuard } from 'src/app/authentication/logged-in.guard';
import { AuthService } from 'src/app/authentication/auth.service';
import { dealReducer } from './shared/store/reducers/deal/deal.reducer';
import { menuReducer } from './shared/store/reducers/selected-menu/menu.reducer';
import { EffectsModule } from '@ngrx/effects';
import { InboxEffects } from './shared/store/effects/inbox.effect';
import { DealEffects } from './shared/store/effects/deal.effect';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { currentUserReducer } from './shared/store/reducers/current-user.reducer';
import { confirmModalPopupService } from 'src/app/modal/confirmService';
import { ConfirmModalComponent } from 'src/app/modal/confirm-model.component';
import { ErrorModalComponent } from './modal/error-modal.component';
import { AmqpService } from './shared/services/amqp/amqp.service';
import { MainComponent } from './main/main.component';
import { QuickViewModalComponent } from './main/home/deal/reports/quickview-modal.component';
import { LoanAdminComponent } from './main/home/toolbar/loanadmin/loanadmin.component';
import { RequirementsDueComponent } from './main/home/deal/deal-details/requirementsdue-modal/requirementdue-modal.component';
import { RequirementsDueFormComponent } from './main/home/deal/deal-details/requirementsdue-modal/requirementdue-form/requirementdue-form.component';
import { UserProfileModalComponent } from './modal/userprofile-model/userprofile-model.component';
import { OutOfOfficeModalComponent } from './modal/outofoffice-modal/outofoffice-modal.component';
import { ManageParticipationModalComponent } from './modal/manageparticipation-modal/manageparticipation-modal.component';
import { DealQuickViewModalComponent } from './modal/dealquickview-modal/dealquickview-modal.component';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MainModule } from '../app/main/main.module';
import { RequirementAddComponent } from './modal/requirement-add/requirement-add.component';
import { DocumentAddComponent } from './modal/document-add/document-add.component';
import { ReportApprovalModalComponent } from './modal/report/report-approval-modal.component';
import { ReportApprovalComponent } from './modal/approval-report/report-approvals.component';
import { SafePipe } from './shared/pipe/safeurl.pipe';
import { ThreadComponent } from './shared/thread/thread.component';
import { jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
import { AssignModalComponent } from '../app/modal/assign-deal/assign-modal.component';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { SelectModule } from 'ng2-select';
import { CdkColumnDef } from '@angular/cdk/table';
import { AddPartyComponent } from './modal/add-party/add-party.component';
import { RemoveLoanConfirmModalComponent } from './modal/removeloanconfirmation/removeloanconfirmation.component';
import { jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { ParticipantModalComponent } from '../app/modal/show-participant/participant-modal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DragDropDirective } from './shared/directives/dragDropDirective/drag-drop.directive';
import { DocumentEditComponent } from './modal/document-edit/document-edit.component';
import { DeleteParticipantModalComponent } from './modal/delete-participant/delete-participant-modal.component';
import { DocumentsUploadComponent } from './shared/documents-upload/documents-upload.component';
import { StageChangeComponent } from './modal/stage-change/stage-change.component';
import { ProgressBarColorDirective } from './shared/directives/progress-bar-color/progress-bar-color.directive';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';
import { HasPermissionDirective } from './shared/directives/has-permission.directive';
import { RequiredLoanFieldsComponent } from './modal/required-loan-fields/required-loan-fields.component';
import { ReqQuestionModalComponent } from './modal/req-question/req-question.component';

import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { AddManualRequrementComponent } from './modal/add-manual-requrement/add-manual-requrement.component';
import { SearchDocuments } from './main/home/deal/deal-details/document3-modal/filter-Docs.pipe';
import { AddParticipantModalComponent } from './modal/add-participant-modal/add-participant-modal.component';
import { AddExternalParticipantModalComponent } from './modal/add-external-participant-modal/add-external-participant-modal.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { RelatedDocumentsComponent } from './modal/related-documents/related-documents.component';
import { environment } from 'src/environments/environment';
import { API_BASE_URL } from 'src/app/shared/services/service-proxy/service-proxies';
import { GlobalRemoveModalComponent } from './modal/global-remove-modal/global-remove-modal.component';
import { AddExistingPartyFormComponent } from './modal/add-party/add-existing-party-form/add-existing-party-form.component';
import { CacheRouteReuseStrategy } from './shared/RouterStateSnapsot/cache-route-reuse.strategy';
import { CustomValidatorsComponent } from './shared/validators/custom-validators/custom-validators.component';
import { AddNewPartyComponent } from './modal/add-party/add-new-party/add-new-party.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AddExternalParticipantComponent } from './modal/add-external-participant/add-external-participant.component';
import { ExternalService } from './modal/add-external-participant/external.service';
import { AddparticipantModelComponent } from './modal/add-internal-participant/add-internal-participant.component';
// import { ConfirmationAlertComponent } from './modal/confirmation-alert/confirmation-alert.component';
import { ActionNoitifyService } from './shared/layout/nav/header/header.service';
import { HistoryModalComponent } from "./modal/history-modal/history-modal.component";
import { ParticipantEditComponent } from './modal/participant-edit-modal/participant-edit.component';
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync(
    {
      keys: ['inbox', 'selectedMenu', 'deal', 'currentUser'],
      rehydrate: true
    })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    ErrorModalComponent,
    QuickViewModalComponent,
    LoanAdminComponent,
    RequirementsDueComponent,
    RequirementsDueFormComponent,
    UserProfileModalComponent,
    OutOfOfficeModalComponent,
    ManageParticipationModalComponent,
    DealQuickViewModalComponent,
    RequirementAddComponent,
    DocumentAddComponent,
    ReportApprovalModalComponent,
    SafePipe,
    ThreadComponent,
    AssignModalComponent,
    AddPartyComponent,
    ReportApprovalComponent,
    RemoveLoanConfirmModalComponent,
    ParticipantModalComponent,
    AddParticipantModalComponent,
    AddExternalParticipantModalComponent,
    DragDropDirective,
    DocumentEditComponent,
    DeleteParticipantModalComponent,
    DocumentsUploadComponent,
    StageChangeComponent,
    ProgressBarColorDirective,
    // LoaderComponent,
    HasPermissionDirective,
    RequiredLoanFieldsComponent,
    ReqQuestionModalComponent,
    AddManualRequrementComponent,
    SnackbarComponent,
    RelatedDocumentsComponent,
    GlobalRemoveModalComponent,
    AddExistingPartyFormComponent,
    CustomValidatorsComponent,
    AddNewPartyComponent,
    // SearchDocuments
    AddExternalParticipantComponent,
    AddparticipantModelComponent,
    HistoryModalComponent,
    // ConfirmationAlertComponent,
    ParticipantEditComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AdminModule,
    MainModule,
    ServiceProxyModule,
    StoreModule.forRoot({
      inbox: inboxReducer,
      recentMenu: menuReducer,
      deal: dealReducer,
      selectedMenu: menuReducer,
      currentUser: currentUserReducer
    },
      { metaReducers }),
    AppRoutingModule,
    EffectsModule.forRoot([InboxEffects, DealEffects]),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    //jqxGridModule
    //jqxButtonModule,
    jqxWindowModule,
    jqxCheckBoxModule,
    jqxTabsModule,
    jqxDropDownListModule,
    SelectModule,
    jqxComboBoxModule,
    TextMaskModule,
    NgxMatSelectSearchModule

  ],

  entryComponents: [
    ParticipantEditComponent,
    ConfirmModalComponent,
    ErrorModalComponent,
    QuickViewModalComponent,
    LoanAdminComponent,
    RequirementsDueComponent,
    UserProfileModalComponent,
    OutOfOfficeModalComponent,
    ManageParticipationModalComponent,
    DealQuickViewModalComponent,
    RequirementAddComponent,
    DocumentAddComponent,
    ReportApprovalModalComponent,
    AssignModalComponent,
    RemoveLoanConfirmModalComponent,
    AddPartyComponent,
    AddParticipantModalComponent,
    AddExternalParticipantModalComponent,
    ParticipantModalComponent,
    DocumentEditComponent,
    DeleteParticipantModalComponent,
    DocumentsUploadComponent,
    StageChangeComponent,
    RequiredLoanFieldsComponent,
    ReqQuestionModalComponent,
    AddManualRequrementComponent,
    AddExternalParticipantComponent,
    RelatedDocumentsComponent,
    SnackbarComponent,
    HistoryModalComponent,
    GlobalRemoveModalComponent,
    AddExistingPartyFormComponent,
    AddNewPartyComponent,
    AddparticipantModelComponent
  ],
  providers: [
    // SearchDocuments,
    CdkColumnDef,
    AdalService,
    SecretService,
    AuthService,
    LoggedInGuard,
    LocalstorageService,
    PermissionService,
    ExternalService,
    ActionNoitifyService,
    confirmModalPopupService,
    {
      provide: InjectableRxStompConfig,
      useValue: SimonStompConfig
    },

    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    },
    {
      provide: API_BASE_URL,
      useValue: environment.baseUrl
    },
    NgbActiveModal,
    AmqpService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy  },
  ],
  bootstrap: [AppComponent],
  exports: [
    StageChangeComponent,
    NgxMatSelectSearchModule
  ],
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
