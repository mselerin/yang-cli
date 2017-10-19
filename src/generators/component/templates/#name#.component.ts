import {Component, OnInit} from '@angular/core';

@Component({
   selector: '<%=kebabName%>',
   <% if (template) {%>templateUrl: './<%=kebabName%>.component.html'<% }else{ %>template: `<div></div>`<% } %><% if (styles) {%>,
   styleUrls: ['./<%=kebabName%>.component.scss']<% } %>
})
export class <%=pascalName%>Component implements OnInit
{
   constructor() {}
   ngOnInit() {}
}
