import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation, Output } from '@angular/core';
import { RequirementServiceProxy, CodeServiceProxy, ProcessStageServiceProxy } from '../../services/service-proxy/service-proxies';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { confirmModalPopupService } from 'src/app/modal/confirmService';


@Component({
  selector: 'app-req-form',
  templateUrl: './req-form.component.html',
  styleUrls: ['./req-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReqFormComponent implements OnInit {
  modalRef: NgbModalRef;
  assignForm: FormGroup;
  deferForm: FormGroup;
  reqDetailForm: FormGroup;
  reqList: boolean;
  editDateDue: boolean;
  editDateExp: boolean;
  dropDownList: string;
  userDrop: Array<any> = [];
  @Input() requirements: Array<any> = [];
  @Input() dealId: number = 0;
  requirement: any = {};
  showMessage: boolean = false;
  @Output() desableAction: boolean = false;

  constructor(private requirementService: RequirementServiceProxy,
    private codeService: CodeServiceProxy,
    private fb: FormBuilder,
    private processStageService: ProcessStageServiceProxy,
    private confirmService: confirmModalPopupService) { }

  ngOnInit() {
    this.reqList = true;
    this.editDateDue = false;
    this.editDateExp = false;
    this.assignForm = this.fb.group({
      search: ['', [
        Validators.minLength(5)
      ]]
    });

    this.deferForm = this.fb.group({
      search: ['', [
        Validators.minLength(5)
      ]]
    });

    this.reqDetailForm = this.fb.group({
      action: ['', [

      ]],
      assignTo: ['', [

      ]],
      question1: ['', [

      ]],
      question2: ['', [

      ]]

    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.requirements.length > 0) {
      this.requirements.forEach(req => {
        if (req.statusDescription === 'Open') {
          req.background = 'u-background-red';
        } else {
          if (req.statusDescription.toLowerCase().indexOf('complete') > -1 ||
            req.statusDescription.toLowerCase().indexOf('n/a') > -1) {
            req.background = 'u-background-green';
          } else {
            if (req.statusDescription.toLowerCase().indexOf('def') > -1 ||
              req.statusDescription.toLowerCase().indexOf('pend') > -1) {
              req.background = 'u-background-orange';
            } else {
              req.background = 'u-background-grey';
            }
          }
        }
      });
    }

  }


  toggleList() {
    this.reqList = !this.reqList;
  }

  toggleDateDue() {
    this.editDateDue = !this.editDateDue;
  }

  toggleDateExp() {
    this.editDateExp = !this.editDateExp;
  }

  showRequirementDetails(req) {
    this.requirementService.getRequirementDetails(this.dealId, req.requirementId, req.reqType).subscribe(req => {
      this.requirement = req;
      if (req.statusDescription === 'Open') {
        req.background = 'u-background-red';
      } else {
        if (req.statusDescription.toLowerCase().indexOf('complete') > -1 ||
          req.statusDescription.toLowerCase().indexOf('n/a') > -1) {
          req.background = 'u-background-green';
        } else {
          if (req.statusDescription.toLowerCase().indexOf('def') > -1 ||
            req.statusDescription.toLowerCase().indexOf('pend') > -1) {
            req.background = 'u-background-orange';
          }
        }
      }
      this.getActionForRequirement(req);
    });
  }


  stopPropagation(event) {
    event.stopPropagation();
  }

  getActionForRequirement(req) {

    if (!req.stageDrop) {
      let needsExceptionActions = false, primaryDocumentException = false;

      if (req.exception == true || (req.requireDocument == true && req.missingDocument == true)) {
        needsExceptionActions = true;
        // if there's already an existing exception or if a document is required but missing, then this is an exception
        if (req.requireDocument == true && req.missingDocument == true) {
          primaryDocumentException = true;
        }
        // check to see if this is specifically a missing document exception
      }
      else if (req.showCompareFlag == "1" && req.sctualValue == null) {
        needsExceptionActions = null;
      }
      // this is a requirement with a question that hasn't been answered yet, so send a null
      if (req.exception != null && req.ExceptionFlag == false && primaryDocumentException == false) {
        needsExceptionActions = false;
      }
      // this requirement has an existing exception condition,
      // but it will be overriden based on the requirement definition as long as a primary document is not also required

      this.codeService.getProcessStageFunction(req.initiateProcessId, req.actionStatus || req.status, "mmcbroom", needsExceptionActions || false)
        .subscribe(data => {
          req.stageDrop = data;
          // data.filter(x => {
          //   return;
          // })
          // $scope.setAssignedTo($scope.actionStatus);
          // $scope.setAssignedTo(actionStatus, req);
          // Sets flags for row icons
          // $scope.setReqPortletIconFlags(data);

        });


    }
  }

  getRequirementDocuments(requirementId, documentCount, req) {
    if (documentCount > 0) {
      this.requirementService.getDocumentsForRequirement(requirementId).subscribe(res => {
        var req = this.requirements.filter(rP => {
          return rP.requirementId == requirementId;
        })[0];
        req.documents = [];
        req.documents = res;
        req.documentCount = res.length;
      });
    }
  }

  get search() {
    return this.assignForm.get('search');
  }

  searchAssignToUsers() {
    return "";
  }

  setAssignedTo(status, req) {
    //// status is an object returned from the UI dropdown with several properties we need to look at
    //if (isJson(status) == false || !status)
    //    return;
    if ((!(typeof status === "object") && status !== null) || !status)
      return;

    //var selectedObject = status;//angular.fromJson(status);

    var selectedObject = req.stageDrop.filter(function (i) { return i.id == status.value })[0];

    // $scope.requirementSideForm.status = selectedObject.id;
    req.actionStatus = selectedObject.id;
    if (req) {
      req.functionId = selectedObject.functionId;
      req.processStageFunctionId = selectedObject.processStageFunctionId;
      if (selectedObject.type) {
        req.actionType = selectedObject.type;
      }
    }

    if (selectedObject && selectedObject.notifyDefinition)
      req.notifyDefinition = selectedObject.notifyDefinition
    else
      req.notifyDefinition = null;

    //if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'u') {
    //if (selectedObject && selectedObject.name.toLowerCase() == 'assign') {

    if (selectedObject && selectedObject.type.toLowerCase() == "u") {
      req.showUserDrop = true;
      if (req.assignedTo == null) {
        req.assigneToReq = true;
      }
      else {
        req.assignedToFullName;
      }
      this.getUserDropDownData(req, selectedObject.functionId);
    }
    else
      req.showUserDrop = false;
    //if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'd')
    //if (selectedObject && selectedObject.name.toLowerCase() == 'defer')
    if (selectedObject && selectedObject.type.toLowerCase() == 'd') {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
      req.showDeferDrop = true;
    }
    else
      req.showDeferDrop = false;

  }

  getUserDropDownData(requirement, functionId) {
    if (functionId == undefined) {
      functionId = "ReqAssign";
    }
    this.processStageService.getProcessStageFunctionUser(requirement.processId, requirement.stageId, functionId, "mmcbroom")
      .subscribe(data => {
        requirement.userDrop = data;
      });
  }

  getDeferToDropDown(requirementId, dealId, req) {
    this.processStageService.getDeferTo(requirementId, dealId)
      .subscribe(
        data => {
          req.deferDrop = data;
        });
  };

  onDeferUserMenuOpen(req, action) {
    if (action.type.toLowerCase() == "d") {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
    }
    else if (action.type.toLowerCase() == "u") {
      this.getUserDropDownData(req, action.functionId)
    }
  }



  setAssignToUser(event, req) {
    req.assignedToFullName = event.option.value;
  }

  setDifferTo(event, req) {
    req.deferToStage = event.value;
  }

  getMenuStages(actions) {
    if (actions) {
      return actions.filter(action => {
        return action.type.toLowerCase() == "d" || action.type.toLowerCase() == "u";
      })
    }
  }

  getActionStages(actions) {
    if (actions) {
      return actions.filter(action => {
        return action.type.toLowerCase() != "d" && action.type.toLowerCase() != "u";
      })
    }
  }

  openModal() {
    this.modalRef = this.confirmService.openRequirementAddModal('Requirement Add');
    this.modalRef.componentInstance.onSaveClick.subscribe(() => {
      this.modalRef.close();
    });
  }

  toggleShowMessage() {
    this.showMessage = !this.showMessage;
  }

}
