import {Component, OnInit} from '@angular/core';

@Component({
   selector: '<%=dasherize_name%>',
   <% if (template) {%>templateUrl: './<%=dasherize_name%>.component.html'<% }else{ %>template: `<div></div>`<% } %><% if (styles) {%>,
   styleUrls: ['./<%=dasherize_name%>.component.scss']<% } %>
})
export class <%=classify_name%>Component implements OnInit
{
   constructor() {}
   ngOnInit() {}
}
