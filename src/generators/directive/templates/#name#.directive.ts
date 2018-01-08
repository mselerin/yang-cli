import {Directive, AfterContentInit, ElementRef} from '@angular/core';

@Directive({
   selector: '[<%=dasherize_name%>]'
})
export class <%=classify_name%>Directive implements AfterContentInit
{
   constructor(
      private element: ElementRef
   ) {}

   ngAfterContentInit() {
   }
}
