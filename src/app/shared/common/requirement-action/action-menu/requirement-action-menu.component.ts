import { Component, OnInit, Input } from '@angular/core';
import { RequirementActionComponent } from '../requirement-action.component';
import { FormGroup } from '@angular/forms';


/// This is derived class for requirement action template
/// Any logic is in base class for this - ** RequirementActionComponent **
/// Only add any logic specific to displaying requirement acxtion menu only
@Component({
  selector: 'requirement-action-menu',
  templateUrl: './requirement-action-menu.component.html',
  styleUrls: ['./requirement-action-menu.component.css']
})
export class RequirementActionMenuComponent extends RequirementActionComponent implements OnInit {
  @Input() assignForm: FormGroup;
  @Input() deferForm: FormGroup;
  ngOnInit() {
  }

  get search() {
    return this.assignForm.get('search');
  }
    setDirty(obj: any) {
    obj.isDirty = true;
  }

}
