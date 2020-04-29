import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DealServiceProxy, ReportServiceProxy, ParticipantServiceProxy, WorkFlowServiceProxy, WorkFlowRequestDto, CodeServiceProxy, NotificationRequestDto, NotificationServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.state';
import { Deal } from 'src/app/shared/models/deal.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxWindowComponent } from 'jqwidgets-ng/jqxwindow';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/main/home/deal/deal-details/party-modal/party-form/party-form-service/event-emitter.service';

@Component({
    selector: 'assign-modal',
    templateUrl: './assign-modal.component.html'

})
export class AssignModalComponent implements OnInit {
    @Input() title;
    @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
    currentDealData: Deal;

    @ViewChild('windowReference') window: jqxWindowComponent;
    @ViewChild('jqxWidget') jqxWidget: ElementRef;

    dealDetails: any;
    isExistAssignedUserFullName: boolean;
    users: Array<any> = [];
    items: Array<any> = [];
    workFlowRequest: {};
    notificationRequest: {};
    getProcessDetails: any;
    dealDates$: Observable<any>;
    activeDeal: any;
    getProcessStageFunctionDetails: any;
    notifyDefinitionId: any;
    processStageFunctionStageId: any;
    workFlowRequestDto: WorkFlowRequestDto = new WorkFlowRequestDto();
    notificationRequestDto: NotificationRequestDto = new NotificationRequestDto();
    private value: any = {};
    private _disabledV: string = '0';
    disabled: boolean = false;
    currentDealId: string;
    currentUserInfo: any;
    userId: string;

    constructor(public activeModal: NgbActiveModal, private dealService: DealServiceProxy, private store: Store<AppState>, private participantsService: ParticipantServiceProxy, private workFlowService: WorkFlowServiceProxy, private codeService: CodeServiceProxy, private notificationService: NotificationServiceProxy, private eventEmitterService: EventEmitterService) {
    }

    ngOnInit() {

        // Auto Complete for Assign User
        // this.participantsService.getUsersForDropdown().subscribe(usrs => {
        //     this.items = usrs;
        // });
        //debugger;
        this.getUserNamesToBeAssigned();

    }
    getUserNamesToBeAssigned() {
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
            this.currentDealId = this.currentDealData.dealId;
        })

        this.store.select(state => state.currentUser).subscribe(result => {
            debugger
            this.currentUserInfo = result;
            this.userId = result.userId;
        });

        this.dealService.getDealDates(parseInt(this.currentDealId)).subscribe(res => {
            this.codeService.getProcessStageFunctionUser(res.processId, res.statusCode, 'WorkflowAssign', this.userId).subscribe(res => {
                //debugger;
                this.items = res.map(data => {
                    return {
                        id: data.id,
                        text: data.firstName + " " + data.lastName
                    }
                });
            })
        })
    }

    updateAssignDealDetails() {
        //debugger;
        // Gets Current Deal Deatails
        this.store.select(state => state.deal).subscribe(result => {
            this.currentDealData = result.filter(x => x.active == true)[0];
        })

        // Get the Process details like ProcessId, StatucCode etc...
        // These are passed as a parameters to get ProcessStageFunctionDetails
        if (this.currentDealData) {
            this.getProcessDetails = this.dealService.getAssignedUserNameForDeal(parseInt(this.currentDealData.dealId)).subscribe(res => {
                this.getProcessDetails = res;

                // Get Process Stage Function Details like NotifyDefinitionId, FunctionUniqueId etc...
                if (this.getProcessDetails.processId && this.getProcessDetails.statusCode) {
                    this.getProcessStageFunctionDetails = this.codeService.getProcessStageFunctionObject(this.getProcessDetails.processId, this.getProcessDetails.statusCode, 'WorkflowAssign').subscribe(data => {
                        this.getProcessStageFunctionDetails = data;
                    });

                    // Set NotifyDefinitionId and FunctionUniqueId  to workflowRequest object
                    if (this.getProcessStageFunctionDetails != null && this.getProcessStageFunctionDetails.notifyDefinitionId && this.getProcessStageFunctionDetails.functionUniqueId) {
                        this.notifyDefinitionId = this.getProcessStageFunctionDetails.notifyDefinitionId;
                        this.processStageFunctionStageId = this.getProcessStageFunctionDetails.functionUniqueId;
                    }

                    // Set workFlowRequestDto
                    this.workFlowRequestDto.debug = false;
                    this.workFlowRequestDto.processHistoryId = this.getProcessDetails.processHistoryId;
                    this.workFlowRequestDto.parentProcessHistoryId = null;
                    this.workFlowRequestDto.submittedToCf = null;
                    this.workFlowRequestDto.passedParameters = '@dealid_05=' + this.currentDealData.dealId + '|';
                    this.workFlowRequestDto.processStageFunctionType = 'F';
                    this.workFlowRequestDto.processStageFunctionId = null;
                    this.workFlowRequestDto.processId = this.getProcessDetails.processId;
                    this.workFlowRequestDto.stageId = this.getProcessDetails.statusCode;
                    this.workFlowRequestDto.containerId = 'Inbox';
                    this.workFlowRequestDto.containerObjectId = 'InboxAssign';
                    this.workFlowRequestDto.functionId = 'WorkflowAssign';
                    this.workFlowRequestDto.resultStageId = null;

                    // LOGGED IN USER Eg : Matt (Make it dynamic)
                    // this.workFlowRequestDto.requestUserId = this.currentuser.username;   
                    this.workFlowRequestDto.requestUserId = 'mmcbroom';

                    this.workFlowRequestDto.assignedUserId = this.value.id;
                    this.workFlowRequestDto.lockUserId = null;
                    this.workFlowRequestDto.reqActualValue = null;
                    this.workFlowRequestDto.reqDueDate = null;
                    this.workFlowRequestDto.documentId = null;
                    this.workFlowRequestDto.currentDate = null;
                    this.workFlowRequestDto.dueDate = null;
                    this.workFlowRequestDto.stageDueDate = null;
                    this.workFlowRequestDto.pendDate = null;

                    // Set notificationRequestDto
                    if (this.notifyDefinitionId && this.value.id && this.value.text) {
                        this.notificationRequestDto.notifyDefinitionId = this.notifyDefinitionId;
                        this.notificationRequestDto.requestUserId = 'mmcbroom';
                        this.notificationRequestDto.assignedUserId = this.value.id;
                        this.notificationRequestDto.processStageFunctionType = 'F';
                        this.notificationRequestDto.processStageFunctionId = this.processStageFunctionStageId;
                        this.notificationRequestDto.notifyParameters = '';
                        this.notificationRequestDto.dealId = parseInt(this.currentDealData.dealId);
                    }

                    // Save/Update 
                    this.workFlowService.updateWorkFlow(this.workFlowRequestDto).subscribe(data => {

                        // Save/Update Notification
                        if (this.notificationRequestDto != null) {

                            this.notificationService.updateNotification(this.notificationRequestDto).subscribe(data => {
                            });
                        }

                        this.activeModal.close();

                        // Refresh Nav Bar
                        this.eventEmitterService.onAssignUserName();
                    });
                }
            });
        }
    }

    // ng2-select (auto complete) Functions() Region Start
    private get disabledV(): string {
        return this._disabledV;
    }

    private set disabledV(value: string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    // Gets the selected value
    public selected(value: any): void {
        ////console.log('Selected value is: ', value);
    }

    // Removes the selected value
    public removed(value: any): void {
        ////console.log('Removed value is: ', value);
    }

    // Types the selected value
    public typed(value: any): void {
        ////console.log('New search input: ', value);
    }

    public refreshValue(value: any): void {
        this.value = value;
    }
    // EndRegion

}
