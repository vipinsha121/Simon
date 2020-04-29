import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequirementServiceProxy, RequirementComment } from 'src/app/shared/services/service-proxy/service-proxies';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
const moment = _moment;
@Component({
  selector: 'requirement-sideform',
  templateUrl: './requirement-sideform.component.html',
  styleUrls: ['./requirement-sideform.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class RequirementSideformComponent implements OnInit {

  @Input() requirement: any;
  @Input() deal: any = {};
  @Input() stageHis: any;
  @Output() closeRequirementSideForm = new EventEmitter<any>();
  @Output() onRequirementUpdate = new EventEmitter
  reqsideform: FormGroup;
  showHistory: boolean = false;
  stageHistory: Array<any> = [];
  editCopy: RequirementComment = new RequirementComment();
  duedateval = new FormControl(moment([2017, 0, 1]));
  constructor(private requirementService: RequirementServiceProxy, private fb: FormBuilder) { }

  ngOnInit() {
    this.reqsideform = this.fb.group({
      duedateval: this.duedateval,
      isMitigatingFactorsval: '',
      mitigatingFactorsval: '',
      isSubjectToval: '',
      SubjectToval: '',
      commentval: ''
    });
  }

  ngOnChanges() {
  }



  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  saveRequirement(req) {
    
    this.editCopy = new RequirementComment();
    this.editCopy.id = req.requirementId;
    this.editCopy.comment = req.comment;
    this.editCopy.isSubjectTo = req.isSubjectTo;
    this.editCopy.isMitigatingFactors = req.isMitigatingFactors;
    this.editCopy.subjectTo = req.subjectTo;
    this.editCopy.mitigatingFactors = req.mitigatingFactors;
    this.editCopy.dueDate = req.dueDate;
    this.editCopy.lastModBy = "mmcbroom";
    this.requirementService.postComments(this.editCopy).subscribe(res => {
      this.requirementService.getRequirementById(req.requirementId)
        .subscribe(reqData => {
          this.inboxRowClear();
          this.clearSideForm();
          this.onRequirementUpdate.emit(reqData);
        });
    });
  }

  clearSideForm() {
    this.closeRequirementSideForm.emit();
  }

  inboxRowClear() {
  }
}
