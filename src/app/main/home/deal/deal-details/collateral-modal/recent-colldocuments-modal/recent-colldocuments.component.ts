import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'recent-colldocuments',
    templateUrl: './recent-colldocuments.component.html',
    styleUrls: ['./recent-colldocuments.component.css']
})
export class RecentCollateralDocsComponent implements OnInit {

    @Input() collateraldocuments: any;
    constructor() { }

    ngOnInit() {
        if (this.collateraldocuments) {
        }
    }

}