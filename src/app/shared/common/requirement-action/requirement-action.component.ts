import { OnInit, Input, Injectable } from '@angular/core';
import { CodeServiceProxy, ProcessStageServiceProxy } from '../../services/service-proxy/service-proxies';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Injectable()
export class RequirementActionComponent implements OnInit {
  @Input() requirement: any = {};
  @Input() dealId = 0;

  filterUserDrop = new FormControl();

  constructor(private codeService: CodeServiceProxy,
              private processStageService: ProcessStageServiceProxy) {

  }

  ngOnInit() {
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
      } else if (req.showCompareFlag == '1' && req.sctualValue == null) {
        needsExceptionActions = null;
      }
      // this is a requirement with a question that hasn't been answered yet, so send a null
      if (req.exception != null && req.ExceptionFlag == false && primaryDocumentException == false) {
        needsExceptionActions = false;
      }
      // this requirement has an existing exception condition,
      // but it will be overriden based on the requirement definition as long as a primary document is not also required

      this.codeService.getProcessStageFunction(req.initiateProcessId, req.actionStatus || req.status, 'mmcbroom', needsExceptionActions || false)
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

  getMenuStages(actions) {
    if (actions) {
      return actions.filter(action => {
        return action.type.toLowerCase() == 'd' || action.type.toLowerCase() == 'u';
      });
    }
  }

  getActionStages(actions) {
    if (actions) {
      return actions.filter(action => {
        return action.type.toLowerCase() != 'd' && action.type.toLowerCase() != 'u';
      });
    }
  }

  setAssignedTo(status, req) {
    //// status is an object returned from the UI dropdown with several properties we need to look at
    // if (isJson(status) == false || !status)
    //    return;
    if ((!(typeof status === 'object') && status !== null) || !status) {
      return;
    }

    // var selectedObject = status;//angular.fromJson(status);

    let selectedObject = req.stageDrop.filter(function(i) { return i.id == status.id && i.functionId == status.functionId; })[0];
    // $scope.requirementSideForm.status = selectedObject.id;
    req.actionStatus = selectedObject.id;
    if (req) {
      req.functionId = selectedObject.functionId;
      req.processStageFunctionId = selectedObject.processStageFunctionId;
      if (selectedObject.type) {
        req.actionType = selectedObject.type;
      }
    }

    if (selectedObject && selectedObject.notifyDefinition) {
      req.notifyDefinition = selectedObject.notifyDefinition
    }
    else {
      req.notifyDefinition = null;
    }

    // if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'u') {
    // if (selectedObject && selectedObject.name.toLowerCase() == 'assign') {

    if (selectedObject && selectedObject.type.toLowerCase() == 'u') {
      this.filterUserDrop.setValidators(Validators.required);
      this.filterUserDrop.markAsTouched();
      req.showUserDrop = true;
      if (req.assignedTo == null) {
        req.assigneToReq = true;
      } else {
        req.assignedToFullName;
      }
      this.getUserDropDownData(req, selectedObject.functionId);
    } else {
      this.filterUserDrop.reset();
      this.filterUserDrop.clearValidators();
      req.showUserDrop = false;
    }
    // if (sObj && sObj.length && sObj[0].type && sObj[0].type.toLowerCase() == 'd')
    // if (selectedObject && selectedObject.name.toLowerCase() == 'defer')
    if (selectedObject && selectedObject.type.toLowerCase() == 'd') {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
      req.showDeferDrop = true;
    } else {
      req.showDeferDrop = false;
    }

    // alert(req.actionStatus);
  }


  setAssignToUser(event, req) {
   // req.assignedToFullName = event.option.value;
    req.assignedTo = event.option.value;
    var selectedObject = req.userDrop.filter(function(i) { return i.userId == event.option.value; })[0];
    req.assignedToFullName = selectedObject.firstName + ' ' + selectedObject.lastName;
  }

  setDifferTo(event, req) {
    req.deferToStage = event.value;
  }
  searchAssignToUsers() {
    return '';
  }

  getUserDropDownData(requirement, functionId) {
    if (functionId == undefined) {
      functionId = 'ReqAssign';
    }
    this.processStageService.getProcessStageFunctionUser(requirement.processId, requirement.stageId, functionId, 'mmcbroom')
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
  }

  onDeferUserMenuOpen(req, action) {
    if (action.type.toLowerCase() == 'd') {
      this.getDeferToDropDown(req.requirementId, this.dealId, req);
    } else if (action.type.toLowerCase() == 'u') {
      this.getUserDropDownData(req, action.functionId);
    }
  }

  filterUser() {
    if (this.requirement.userDrop) {
      return this.requirement.userDrop
        .filter(usr => {
          if (this.filterUserDrop.value) {
            return (usr.firstName + " " + usr.lastName).toLowerCase().includes(this.filterUserDrop.value.toLowerCase())
          }
        }
        );
    }
  }

}
