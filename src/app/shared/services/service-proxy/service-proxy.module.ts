import { NgModule } from '@angular/core';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.AdmLoanProductServiceProxy,
    ApiServiceProxies.AnnouncementServiceProxy,
    ApiServiceProxies.DealMessagesServiceProxy,
    ApiServiceProxies.EditMessagesServiceProxy,
    ApiServiceProxies.CodeServiceProxy,
    ApiServiceProxies.CollateralServiceProxy,
    ApiServiceProxies.ConfigServiceProxy,
    ApiServiceProxies.DealServiceProxy,
    ApiServiceProxies.DocDefinationServiceProxy,
    ApiServiceProxies.DocumentServiceProxy,
    ApiServiceProxies.EcmDocumentManagerServiceProxy,
    ApiServiceProxies.InboxServiceProxy,
    ApiServiceProxies.LoanServiceProxy,
    ApiServiceProxies.MessagingServiceProxy,
    ApiServiceProxies.ParticipantServiceProxy,
    ApiServiceProxies.PartyServiceProxy,
    ApiServiceProxies.ProcessStageServiceProxy,
    ApiServiceProxies.ReportServiceProxy,
    ApiServiceProxies.RequirementServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.ValuesServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.WorkFlowServiceProxy,
    ApiServiceProxies.NotificationServiceProxy
  ]
})
export class ServiceProxyModule { }
