import { Component, OnInit, AfterViewInit, OnChanges, Input } from '@angular/core';
import { RequirementActionComponent } from '../requirement-action.component';
import { FormGroup, Validators } from '@angular/forms';


/// This is derived class for requirement action template
/// Any logic is in base class for this - ** RequirementActionComponent **
/// Only add any logic specific to displaying requirement acxtion slect only
@Component({
  selector: 'requirement-action-select',
  templateUrl: './requirement-action-select.component.html',
  styleUrls: ['./requirement-action-select.component.css']
})
export class RequirementActionSelectComponent extends RequirementActionComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() reqDetailForm: FormGroup;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: any): void {
    if (this.requirement && this.requirement.requirementId) {
      this.getActionForRequirement(this.requirement);      
    }
  }

  public checkOption(action) {
    if(action.name) {
      if (action.name == "Defer") {
        this.reqDetailForm.get('deferForm').setValidators(Validators.required)
        this.reqDetailForm.get('deferForm').markAsTouched()
      }
      else {
        this.reqDetailForm.get('deferForm').clearValidators()
        this.reqDetailForm.get('deferForm').reset()
        // this.reqDetailForm.get('asignForm').setValidators(Validators.required)
      }
      if (action.name == "Assign") {
        this.reqDetailForm.get('assignForm').setValidators(Validators.required)
        this.reqDetailForm.get('assignForm').markAsTouched()
      }
      else {
        this.reqDetailForm.get('assignForm').clearValidators()
        this.reqDetailForm.get('assignForm').reset()
        // this.reqDetailForm.get('asignForm').setValidators(Validators.required)
      }
    }
  }

}
