import { Component, OnInit, Input } from '@angular/core';
import { RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';

@Component({
    selector: 'processes-modal',
    templateUrl: './processes-modal.component.html',
    styleUrls: ['./processes-modal.component.css']
})
export class ProcessesModalComponent implements OnInit {

    @Input() currentDeal: any;
    processes: Array<any> = [];
    processesCount: number;
    page: number = 1;
    pageSize: number = 10;

    constructor(private requiremtService: RequirementServiceProxy) { }

    ngOnInit() {
        this.requiremtService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {
            var data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
            this.processes = data;
            this.processesCount = this.processes.length;
        })
    }

}
