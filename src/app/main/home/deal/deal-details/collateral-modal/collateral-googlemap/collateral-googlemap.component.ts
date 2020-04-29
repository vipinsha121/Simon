import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'collateral-googlemap',
    templateUrl: './collateral-googlemap.component.html',
    styleUrls: ['./collateral-googlemap.component.css']
})
export class CollateralGoogleMapComponent implements OnInit {

    @Input() collateralGMap: any;
    constructor() { }

    ngOnInit() {
        if (this.collateralGMap) {
        }
    }

}