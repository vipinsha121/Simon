import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';

@Component({
  selector: 'app-requirement-add',
  templateUrl: './requirement-add.component.html',
  styleUrls: ['./requirement-add.component.css']
})
export class RequirementAddComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
