import { Directive, ElementRef, AfterViewInit, HostListener, AfterViewChecked, OnInit, ViewChild  } from '@angular/core';

@Directive({
  selector: '[appScrollToBottom]'
})
export class ScrollToBottomDirective implements AfterViewChecked, OnInit {
  constructor(private scrollContainer: ElementRef) {
    //console.log(scrollContainer);
   }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
