import { Directive,OnInit,Input,ElementRef } from '@angular/core';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit{
// @Input() appHasRole: string;
  constructor(private el: ElementRef) { }
ngOnInit() {
  // this.el.nativeElement.disabled = true;
  this.el.nativeElement.style.background = 'red';
}
}



// import {
//   Directive,
//   Input,
//   OnDestroy,
//   OnInit,
//   TemplateRef,
//   ViewContainerRef
// } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
// import { RolesService } from '../services/roles.service';
// import { takeUntil } from 'rxjs/operators';

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective implements OnInit, OnDestroy {
//   @Input() appHasPermission: string;
// permissions: Array<any> = ['messages','global'];
//   stop$ = new Subject();

//   isVisible = false;

//   constructor(
//     private viewContainerRef: ViewContainerRef,
//     private templateRef: TemplateRef<any>,
//     private rolesService: RolesService
//   ) {}

  //  ngOnInit() {
  //   if (this.permissions.includes(this.appHasRole)) {
  //       if (!this.isVisible) {
  //         this.isVisible = true;
  //         this.viewContainerRef.createEmbeddedView(this.templateRef);
  //       }
  //     } else {
  //       this.isVisible = false;
  //       this.viewContainerRef.clear();
  //     }
  // }

//   ngOnDestroy() {
//     this.stop$.next();
//   }
// }
