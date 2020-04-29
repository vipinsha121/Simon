import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'simon-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() currentMenu: any = {};

  constructor() {}

  ngOnInit() {
    
  }

  isDeal() {
    if (this.currentMenu) {
      return this.currentMenu.type === 'Deal';
    }
  }

}
