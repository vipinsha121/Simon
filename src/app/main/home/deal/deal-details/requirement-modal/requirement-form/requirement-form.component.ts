import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-requirement-form',
    templateUrl: './requirement-form.component.html',
    styleUrls: ['./requirement-form.component.css']
})
export class RequirementFormComponent implements OnInit {
    @Input() requirment: any
    constructor() { }

    ngOnInit() {
    }

}