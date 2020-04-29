import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/common/auth/auth.guard';
import { InboxComponent } from './home/inbox/inbox.component';
import { MainComponent } from './main.component';
import { DealComponent } from './home/deal/deal.component';
import { MessageComponent } from './message/message.component';
import { GlobalComponent } from './global/global.component';
import { Requirement2ModalComponent } from './home/deal/deal-details/requirement2-modal/requirement2-modal.component';
import { SummaryModalComponent } from './home/deal/deal-details/summary-modal/summary-modal.component';
import { PartyModalComponent } from './home/deal/deal-details/party-modal/party-modal.component';
import { LoanModalComponent } from './home/deal/deal-details/loan-modal/loan-modal.component';
import { PartyEditComponent } from './home/deal/deal-details/party-modal/party-edit/party-edit.component';
import { PartyFormComponent } from './home/deal/deal-details/party-modal/party-form/party-form.component';
import { CollateralModalComponent } from './home/deal/deal-details/collateral-modal/collateral-modal.component';
import { CollateralFormComponent } from './home/deal/deal-details/collateral-modal/collateral-form/collateral-form.component';
import { RabbitMQMessagesComponent } from '../messages/rabbitmqmessages.component';
import { LoanFormComponent } from './home/deal/deal-details/loan-modal/loan-form/loan-form.component';
import { Document3ModalComponent } from './home/deal/deal-details/document3-modal/document3-modal.component';
import { MessageThreadComponent } from './../shared/messages/message-thread.component';
import { ProcessModalComponent } from './home/deal/deal-details/process-modal/process-modal.component';
import { TicklerModalComponent } from './home/deal/deal-details/tickler-modal/tickler-modal.component';
import { EventModalComponent } from './home/deal/deal-details/events-modal/events-modal.component';
import { DealDatesComponent } from './home/deal/deal-details/deal-dates/deal-dates-modal.component';
import { MessagesComponent } from '../shared/messages/messages/messages.component';
import { PartyDetailsComponent } from "./home/deal/deal-details/party-modal/party-details/party-details.component";
import { PartyRelatedDealsComponent } from "./home/deal/deal-details/party-modal/party-related-deals/party-related-deals.component";
import { DetailsComponent } from "../shared/requirements-list/requirement-details/details/details.component";
import { HistoryComponent } from "../shared/requirements-list/requirement-details/history/history.component";

const routes: Routes = [
  {
    path: 'main', component: MainComponent,
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      {
        path: 'deal/:dealId', component: DealComponent,
        children: [
          {
            path: '',
            component: SummaryModalComponent
          },
          {
            path: 'reqs',
            component: Requirement2ModalComponent
          },
          {
            path: 'docs',
            component: Document3ModalComponent
          },
          {
            path: 'party',
            component: PartyModalComponent,
            children: [
              {
                path: ':partyId',
                component: PartyFormComponent,
                children: [
                  {
                    path: 'requirements',
                    component: DetailsComponent,
                  },
                  {
                    path: 'documents',
                    component: HistoryComponent
                  },
                  {
                    path: 'detail',
                    component: PartyDetailsComponent
                  },
                  {
                    path: 'related-deals',
                    component: PartyRelatedDealsComponent
                  }
                ]
              }

            ]
          },
          {
            path: 'loan',
            component: LoanModalComponent,
            children: [
              {
                path: ':loanId',
                component: LoanFormComponent
              }
            ]
          },
          {
            path: 'collateral',
            component: CollateralModalComponent,
            children: [
              {
                path: ':collateralId',
                component: CollateralFormComponent
              }
            ]
          },
          {
            path: 'edit-party',
            component: PartyEditComponent
          },
          {
            path: 'dealmessages',
            component: MessageThreadComponent
          },
          {
            path: 'process',
            component: ProcessModalComponent
          },
          {
            path: 'tickler',
            component: TicklerModalComponent
          },
          {
            path: 'event',
            component: EventModalComponent
          },
          {
            path: 'date',
            component: DealDatesComponent
          },

        ]
      },
      { path: 'inbox', component: InboxComponent },
      { path: 'global', component: GlobalComponent },
      { path: 'message', component: MessageComponent },
      {
        path: "rabbitmq",
        component: RabbitMQMessagesComponent
      }
    ]
  },

  { path: '**', redirectTo: 'main' }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
