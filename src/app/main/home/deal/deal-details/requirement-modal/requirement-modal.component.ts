import { Component, OnInit, Input } from '@angular/core';
import { RequirementServiceProxy } from 'src/app/shared/services/service-proxy/service-proxies';

@Component({
  selector: 'requirement-modal',
  templateUrl: './requirement-modal.component.html',
  styleUrls: ['./requirement-modal.component.css']
})
export class RequirementModalComponent implements OnInit {

  @Input() currentDeal: any;
  requirements: Array<any> = [];
  requirementsCount: number;
  page: number = 1;
  pageSize: number = 10;

  constructor(private requiremtService: RequirementServiceProxy) { }

  ngOnInit() {
    this.requiremtService.getRequirementList(this.currentDeal.id).subscribe(requirementList => {
      var data = requirementList.partyRequirement.concat(requirementList.collateralRequirement, requirementList.dealRequirement, requirementList.loanRequirement, requirementList.requirementRequirement);
      this.requirements = data;
      this.requirementsCount = this.requirements.length;
    })
  }

}
