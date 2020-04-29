import { Directive, Input, OnChanges, SimpleChanges, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appProgressBarColor]'
})
export class ProgressBarColorDirective implements OnInit, OnChanges {

  static counter = 0;

  @Input() appProgressBarColor;
  styleEl: HTMLStyleElement = document.createElement('style');

  // generate unique attribule which we will use to minimise the scope of our dynamic style
  uniqueAttr = `app-progress-bar-color-${ProgressBarColorDirective.counter++}`;

  constructor(private el: ElementRef) {
    const nativeEl: HTMLElement = this.el.nativeElement;
    nativeEl.setAttribute(this.uniqueAttr, '');
    nativeEl.appendChild(this.styleEl);
  }

  ngOnInit() {
    this.updateColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateColor();
  }

  updateColor(): void{
    // update dynamic style with the uniqueAttr
    this.styleEl.innerText = `
      [${this.uniqueAttr}] .mat-progress-bar-fill::after {
        background-color: ${this.appProgressBarColor};
      }
    `;
  }

}
