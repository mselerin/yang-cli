import {Directive, AfterContentInit, ElementRef} from '@angular/core';

@Directive({
   selector: '[<%=kebabName%>]'
})
export class <%=pascalName%>Directive implements AfterContentInit
{
   constructor(
      private element: ElementRef
   ) {}

   ngAfterContentInit() {
   }
}
