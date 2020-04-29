import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { RequirementServiceProxy } from "../../../services/service-proxy/service-proxies";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnChanges {

  @Input() dealId: number;
  @Input() requirementId: number;
  @Input() reqType: string;
  stageHistory: any;

  constructor(private formBuilder: FormBuilder,
    private requirementService: RequirementServiceProxy,
    public activeModal: NgbActiveModal) { }

  ngOnChanges() {
    this.getStageHistory()
  }

  getStageHistory() {
    if (!this.dealId || !this.requirementId || !this.reqType) return;

    this.requirementService.getRequirementDetails(this.dealId, this.requirementId, this.reqType).subscribe(req => {
      if (req && req.processHistoryId) {
        this.requirementService.getStageHistory(req.processHistoryId).subscribe(res => {
          this.stageHistory = res;
        });
      }
    });
  }

}
